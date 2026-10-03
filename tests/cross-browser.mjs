import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium, firefox, webkit } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.mharisaslam\.com([^<]*)<\/loc>/g)].map(match => match[1] || "/");
const viewports = [
  { name: "phone-320", width: 320, height: 800 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1366", width: 1366, height: 768 }
];
const engines = { chromium, firefox, webkit };
const failures = [];
const passes = [];
await mkdir(new URL("../artifacts", import.meta.url), { recursive: true });

const slug = value => value.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";

async function inspect(page) {
  await page.waitForLoadState("load", { timeout: 3000 }).catch(() => {});
  return page.evaluate(() => {
    const root = document.documentElement;
    const main = document.querySelector("main");
    const hidden = [...document.querySelectorAll("main section, main article")].filter(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return rect.height > 40 && (element.innerText || "").trim().length > 80 &&
        (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0);
    }).map(element => ({ tag: element.tagName, className: element.className, opacity: getComputedStyle(element).opacity }));
    const brokenImages = [...document.images].filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src);
    return {
      title: document.title,
      mainTextLength: (main?.innerText || "").trim().length,
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      hidden,
      brokenImages
    };
  });
}

async function runInteractions(page, viewport, engineName) {
  const issues = [];
  await page.goto(`${baseUrl}/use-cases`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const initialCount = Number(await page.locator("#case-count").innerText());
  const firstFilter = page.locator('#case-filters button[data-filter-value]:not([data-filter-value="All"])').first();
  await firstFilter.click();
  const filteredCount = Number(await page.locator("#case-count").innerText());
  if (initialCount !== 79 || filteredCount < 1 || filteredCount >= initialCount) issues.push(`use-case filter count ${initialCount} -> ${filteredCount}`);
  await page.locator("#reset-filters").click();
  if (Number(await page.locator("#case-count").innerText()) !== 79) issues.push("use-case reset did not restore 79 cases");

  await page.goto(`${baseUrl}/business-performance`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator("#tab-cash").click();
  if (await page.locator("#tab-cash").getAttribute("aria-selected") !== "true") issues.push("Business Performance cash tab not selected");
  if (!await page.locator("#panel-cash").isVisible()) issues.push("Business Performance cash panel not visible");

  await page.goto(`${baseUrl}/contact`, { waitUntil: "domcontentloaded", timeout: 30000 });
  for (const href of ["tel:+96898110669", "https://wa.me/96898110669", "mailto:haris@mharisaslam.com"]) {
    if (await page.locator(`a[href="${href}"]`).count() < 1) issues.push(`missing contact route ${href}`);
  }

  if (viewport.width <= 768) {
    const summary = page.locator(".mobile-nav summary");
    if (!await summary.isVisible()) issues.push("mobile navigation trigger is not visible");
    else {
      await summary.click();
      if (!await page.locator(".mobile-nav").evaluate(element => element.open)) issues.push("mobile navigation did not open");
      await summary.press("Shift+Tab");
      const focusContained = await page.locator(".mobile-panel").evaluate((panel) => panel.contains(document.activeElement));
      if (!focusContained) issues.push("mobile navigation focus did not wrap into the open panel");
      await page.keyboard.press("Escape");
      if (await page.locator(".mobile-nav").evaluate(element => element.open)) issues.push("Escape did not close mobile navigation");
      if (!await summary.evaluate(element => element === document.activeElement)) issues.push("mobile navigation trigger did not regain focus");
    }
  }

  if (issues.length) failures.push({ engine: engineName, viewport: viewport.name, route: "interaction-regressions", issues });
}

await Promise.all(Object.entries(engines).map(async ([engineName, engine]) => {
  const browser = await engine.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        hasTouch: viewport.width <= 768,
        isMobile: viewport.width < 768
      });
      const page = await context.newPage();
      let currentRoute = "";
      let pageErrors = [];
      let consoleErrors = [];
      let responseErrors = [];
      page.on("pageerror", error => pageErrors.push(String(error)));
      page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("response", response => {
        if (response.url().startsWith(baseUrl) && response.status() >= 400) responseErrors.push(`${response.status()} ${response.url()}`);
      });

      for (const route of routes) {
        currentRoute = route;
        pageErrors = [];
        consoleErrors = [];
        responseErrors = [];
        const issues = [];
        try {
          const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
          if (!response || response.status() >= 400) issues.push(`navigation status ${response?.status() ?? "none"}`);
          const state = await inspect(page);
          if (!state.title) issues.push("missing document title");
          if (state.mainTextLength < 200) issues.push(`main content too short (${state.mainTextLength})`);
          if (state.scrollWidth > state.clientWidth + 2) issues.push(`document overflow ${state.scrollWidth}/${state.clientWidth}`);
          if (state.hidden.length) issues.push(`hidden substantive sections ${JSON.stringify(state.hidden.slice(0, 4))}`);
          if (state.brokenImages.length) issues.push(`broken images ${JSON.stringify(state.brokenImages.slice(0, 4))}`);
          if (pageErrors.length) issues.push(`page errors ${JSON.stringify(pageErrors.slice(0, 4))}`);
          if (consoleErrors.length) issues.push(`console errors ${JSON.stringify(consoleErrors.slice(0, 4))}`);
          if (responseErrors.length) issues.push(`resource errors ${JSON.stringify(responseErrors.slice(0, 4))}`);
        } catch (error) {
          issues.push(String(error));
        }
        if (issues.length) {
          failures.push({ engine: engineName, viewport: viewport.name, route, issues });
          if (failures.length <= 30) await page.screenshot({ path: `artifacts/${engineName}-${viewport.name}-${slug(route)}.png`, fullPage: true }).catch(() => {});
        } else passes.push({ engine: engineName, viewport: viewport.name, route });
      }

      await runInteractions(page, viewport, engineName).catch(error => failures.push({ engine: engineName, viewport: viewport.name, route: "interaction-regressions", issues: [String(error)] }));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}));

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routeCount: routes.length,
  engines: Object.keys(engines),
  viewports,
  checks: passes.length + failures.length,
  passes: passes.length,
  failures
};
await writeFile(new URL("../artifacts/cross-browser-report.json", import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ routeCount: report.routeCount, checks: report.checks, passes: report.passes, failures: report.failures.length }, null, 2));
if (failures.length) process.exitCode = 1;
