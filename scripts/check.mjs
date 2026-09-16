import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { navigation, pages, site } from "../src/v2-content.mjs";
import { aiOperatingCases, expandedLibraryCases } from "../src/v4-expansion.mjs";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const routes = new Set(htmlFiles.map(routeFor));
const errors = [];
const titles = new Map();
const descriptions = new Map();
const jobSignals = [
  /available for/i,
  /open to/i,
  /looking for (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /seeking (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /ceo roles?/i,
  /board roles?/i,
  /entrepreneur-in-residence/i,
  /\bEIR\b/i,
  /selected opportunities/i
];
const rejectedLanguage = [
  /what existed\s*\/\s*what was done/i,
  /how I would rebuild this in 2026/i,
  /the constraint behind the work/i,
  /the work is organized around operating problems/i,
  /2026 AI Rebuild/i,
  /executive rule/i,
  /decision model/i
];
const developmentNotes = [
  /missing (?:links?|pages?)/i,
  /recovered content/i,
  /original files/i,
  /preserv(?:ed|ing) pages?/i,
  /source discovery/i
];
const forbiddenCaseNames = /\bSAB\b|Bank Dhofar|Floward|\bBDO\b|KalSoft|Al Raid|Vodafone|VOPAY|Salman Corporation|Miraq|\bKSM\b/i;
const currentEmployerNames = /MARQA|Vodafone Qatar/i;
const permittedRoleSentence = "Currently working on strategic digital-commerce, marketplace and operating-model transformation within a major telecom operator in Qatar.";

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = await readFile(file, "utf8");
  if (route !== "/404") {
    count(html, /<html lang="en">/gi, 1, route, "language");
    count(html, /<meta name="viewport"/gi, 1, route, "viewport");
    count(html, /<main id="main">/gi, 1, route, "main");
    count(html, /class="skip-link"/gi, 1, route, "skip link");
    count(html, /<h1\b/gi, 1, route, "H1");
    count(html, /rel="canonical"/gi, 1, route, "canonical");
    count(html, /application\/ld\+json/gi, 1, route, "JSON-LD");

    const title = capture(html, /<title>(.*?)<\/title>/s);
    const description = capture(html, /<meta name="description" content="(.*?)">/s);
    const canonical = capture(html, /<link rel="canonical" href="(.*?)">/s);
    if (!title || title.length > 65) errors.push(`${route}: title length ${title.length}`);
    if (description.length < 80 || description.length > 190) errors.push(`${route}: description length ${description.length}`);
    if (canonical !== `${site.origin}${route === "/" ? "/" : route}`) errors.push(`${route}: canonical mismatch`);
    unique(titles, title, route, "title");
    unique(descriptions, description, route, "description");

    for (const href of [...html.matchAll(/href="(\/[^"#?]*)/g)].map(match => match[1])) {
      if (href.startsWith("/assets/")) {
        try { await stat(join(root, href.slice(1))); } catch { errors.push(`${route}: missing asset ${href}`); }
      } else if (!routes.has(href)) errors.push(`${route}: broken internal link ${href}`);
    }
    for (const image of [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0])) {
      if (!/\balt="[^"]*"/.test(image)) errors.push(`${route}: image missing alt`);
      if (!/\bwidth="\d+"/.test(image) || !/\bheight="\d+"/.test(image)) errors.push(`${route}: image missing dimensions`);
    }

    const desktop = capture(html, /<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/s);
    const mobile = capture(html, /<nav class="mobile-panel"[^>]*>(.*?)<\/nav>/s);
    for (const [label, nav] of [["desktop", desktop], ["mobile", mobile]]) {
      for (const [name, href] of navigation) {
        if (!nav.includes(`href="${href}"`)) errors.push(`${route}: ${label} navigation missing ${name}`);
      }
      if (nav.includes('href="/ventures"') || nav.includes('href="/work"')) errors.push(`${route}: ${label} has rejected navigation`);
    }

    try {
      const graph = JSON.parse(capture(html, /<script type="application\/ld\+json">(.*?)<\/script>/s));
      if (!Array.isArray(graph["@graph"])) errors.push(`${route}: invalid schema graph`);
      const article = graph["@graph"]?.find(node => node["@type"] === "Article");
      if (article) {
        const h1 = capture(html, /<h1[^>]*>(.*?)<\/h1>/s).replace(/<[^>]+>/g, "").trim();
        if (article.headline !== h1 || !article.datePublished) errors.push(`${route}: article schema mismatch`);
      }
    } catch { errors.push(`${route}: invalid JSON-LD`); }
  }

  for (const regex of jobSignals) if (regex.test(html)) errors.push(`${route}: job-seeking signal ${regex}`);
  for (const regex of rejectedLanguage) if (regex.test(html)) errors.push(`${route}: rejected language ${regex}`);
  for (const regex of developmentNotes) if (regex.test(html)) errors.push(`${route}: public development note ${regex}`);
  if (currentEmployerNames.test(html)) errors.push(`${route}: current-employer name exposed`);
  if (!["/", "/about", "/track-record"].includes(route) && html.includes(permittedRoleSentence)) errors.push(`${route}: current-role sentence appears outside approved pages`);
  if (/[—–]/.test(html)) errors.push(`${route}: em or en dash found`);
  if (html.includes("__bundler") || html.includes("Unpacking...")) errors.push(`${route}: unpacking shell`);
}

if (navigation.length !== 7) errors.push(`navigation must contain seven items, found ${navigation.length}`);
for (const [index, expected] of ["Home", "Track Record", "Use Cases", "AI & Transformation", "Insights", "About", "Contact"].entries()) {
  if (navigation[index]?.[0] !== expected) errors.push(`navigation position ${index + 1}: expected ${expected}`);
}
if (pages.filter(page => page.kind === "track").length !== 4) errors.push("release must have four track-record pages");
if (pages.filter(page => page.kind === "case").length < expandedLibraryCases.length) errors.push(`release must have at least ${expandedLibraryCases.length} public use-case pages`);
if (pages.filter(page => page.kind === "article").length !== 8) errors.push("release must have eight insight pages");
if (pages.length < 95) errors.push(`release must have at least 95 indexable routes, found ${pages.length}`);

const home = await readFile(join(root, "index.html"), "utf8");
for (const sentence of [
  "Building growth engines, fixing business economics and turning ideas into operating models.",
  "GCC operator and business builder working across commerce, retail, marketplaces, enterprise technology, fintech and AI."
]) if (!home.includes(sentence)) errors.push(`home missing required copy: ${sentence}`);
for (const heading of ["Build New Businesses", "Transform Existing Businesses", "Create New Revenue Pools", "Redesign for AI", "Selected business problems", "Operating evidence", "AI Commerce Command Center", "Insights"]) {
  if (!home.includes(heading)) errors.push(`home missing section ${heading}`);
}
for (const marker of ["v3-home-hero", "v3-capability-system", "v3-sector-ribbon", "v3-case-editorial", "v3-value-band", "v3-evidence-band", "v3-ai-products", "v3-insight-ledger"]) {
  if (!home.includes(marker)) errors.push(`home missing visual module ${marker}`);
}
for (const credential of ["17+ years", "GCC", "Founder", "Operator", "Transformation", "Venture Building"]) {
  if (!home.includes(credential)) errors.push(`home missing credential ${credential}`);
}

const trackIndex = await pageHtml("/track-record");
for (const sentence of ["Building, launching and transforming businesses.", "Selected operating roles and ventures where Haris held direct responsibility for building, growth, transformation or investment."]) {
  if (!trackIndex.includes(sentence)) errors.push(`/track-record: missing required copy ${sentence}`);
}
for (const marker of ["p-track-hero", "p-record-stories", "p-record-story", "p-capital-band"]) {
  if (!trackIndex.includes(marker)) errors.push(`/track-record: existing presentation missing ${marker}`);
}
count(trackIndex, /class="p-record-story/g, 4, "/track-record", "operating stories");

for (const page of pages.filter(page => page.kind === "track")) {
  const html = await pageHtml(page.path);
  for (const marker of ["Role and mandate", "What was built or fixed", "Commercial contribution", "Technology and operations", "Business relevance"]) {
    if (!html.includes(marker)) errors.push(`${page.path}: missing track-record field ${marker}`);
  }
  for (const marker of ["report-layout track-report", "report-contents", "report-main", "report-section", "report-exhibit"]) {
    if (!html.includes(marker)) errors.push(`${page.path}: missing documentary module ${marker}`);
  }
  atLeast(html, /class="report-exhibit/g, 6, page.path, "report exhibits");
  atLeast(reportWordCount(html), 600, page.path, "narrative report words");
}

for (const page of pages.filter(page => page.kind === "case")) {
  if (page.path === "/use-cases/leading-saudi-bank-commerce-ecosystem") continue;
  const html = await pageHtml(page.path);
  if (html.includes("report-layout")) {
    for (const marker of ["Executive summary", "Business context", "Business problem", "Commercial", "Technology", "Operating model", "Risks and dependencies"]) {
      if (!html.includes(marker)) errors.push(`${page.path}: missing use-case field ${marker}`);
    }
    if (!/Business impact|Modeled business impact/i.test(html)) errors.push(`${page.path}: missing impact field`);
    for (const marker of ["report-layout", "report-contents", "report-main", "report-section", "report-exhibit", "report-table"]) {
      if (!html.includes(marker)) errors.push(`${page.path}: missing case visual module ${marker}`);
    }
    atLeast(html, /class="report-exhibit/g, 6, page.path, "report exhibits");
    atLeast(reportWordCount(html), 380, page.path, "narrative report words");
  } else if (page.path === "/use-cases/rent-as-a-utility-qatar") {
    for (const marker of ["Executive summary", "Market problem", "Market opportunity", "Commercial model and value pools", "Technology, data and AI layer", "Operating model, exceptions and governance", "Pilot and scale roadmap", "Modeled business impact"]) {
      if (!html.includes(marker)) errors.push(`${page.path}: missing flagship section ${marker}`);
    }
  } else if (aiOperatingCases.some(item => item.href === page.path)) {
    for (const marker of ["Problem and commercial diagnosis", "Operating model", "AI agents and automated workflows", "Technology and data architecture", "Commercial model and KPIs", "Implementation roadmap", "Modeled business impact"]) {
      if (!html.includes(marker)) errors.push(`${page.path}: missing AI case section ${marker}`);
    }
    atLeast(html, /class="v4-ai-exhibit/g, 3, page.path, "AI case exhibits");
    const aiWords = v3WordCount(html);
    if (aiWords < 1000 || aiWords > 2000) errors.push(`${page.path}: expected 1000-2000 AI operating-case words, found ${aiWords}`);
  } else if (html.includes("v4-note-hero")) {
    for (const marker of ["Executive summary", "Business problem and commercial opportunity", "Solution, technology and operating model", "Implementation, KPIs and risk"]) {
      if (!html.includes(marker)) errors.push(`${page.path}: missing strategy-note section ${marker}`);
    }
    if (!/Modeled business impact|Business impact boundary/i.test(html)) errors.push(`${page.path}: missing strategy-note impact boundary`);
    atLeast(html, /class="v4-case-exhibit/g, 3, page.path, "strategy-note exhibits");
    atLeast(v3WordCount(html), 600, page.path, "strategy-note words");
  } else {
    errors.push(`${page.path}: unknown use-case presentation`);
  }
  if (forbiddenCaseNames.test(html)) errors.push(`${page.path}: client or company name leaked into anonymized use case`);
}

const saudiFlagship = await pageHtml("/use-cases/leading-saudi-bank-commerce-ecosystem");
for (const marker of ["v3-case-hero", "v3-case-nav", "v3-case-section", "v3-exhibit", "v3-kpi-table"]) {
  if (!saudiFlagship.includes(marker)) errors.push(`/use-cases/leading-saudi-bank-commerce-ecosystem: missing V3 module ${marker}`);
}
for (const heading of [
  "Executive summary", "Business problem", "Solution design", "Commercial model",
  "Technology, data and AI", "Operating model and governance", "MVP and scale roadmap",
  "Measurement and modeled impact", "Modeled business impact", "Risks and dependencies"
]) if (!saudiFlagship.includes(heading)) errors.push(`/use-cases/leading-saudi-bank-commerce-ecosystem: missing flagship section ${heading}`);
for (const exhibit of [
  "The bank enters after the commercial decision",
  "A commerce-enabled journey starts at declared intent",
  "Bank, merchant and customer ecosystem",
  "Commercial value pools and cost deductions",
  "Technology and data architecture",
  "AI ranks permitted value; policy controls eligibility",
  "Operating model and decision rights",
  "Twelve-month implementation roadmap"
]) if (!saudiFlagship.includes(exhibit)) errors.push(`/use-cases/leading-saudi-bank-commerce-ecosystem: missing flagship exhibit ${exhibit}`);
for (const term of ["cardholder segmentation", "merchant-funded", "customer consent", "attribution", "merchant settlement", "net incremental contribution", "90-day"]) {
  if (!saudiFlagship.toLowerCase().includes(term.toLowerCase())) errors.push(`/use-cases/leading-saudi-bank-commerce-ecosystem: missing commercial depth ${term}`);
}
count(saudiFlagship, /<figure class="v3-exhibit\b/g, 8, "/use-cases/leading-saudi-bank-commerce-ecosystem", "flagship exhibits");
const saudiWords = v3WordCount(saudiFlagship);
if (saudiWords < 1500 || saudiWords > 3000) errors.push(`/use-cases/leading-saudi-bank-commerce-ecosystem: expected 1500-3000 report words, found ${saudiWords}`);

const rentFlagship = await pageHtml("/use-cases/rent-as-a-utility-qatar");
for (const exhibit of [
  "Current cheque problem map", "Future rent-as-a-utility ecosystem", "Tenant journey from lease to reconciliation",
  "Stakeholder value exchange", "Commercial model and revenue-share logic", "API-first technology and data architecture",
  "Settlement and reconciliation flow", "Operating model and decision rights", "Risk and control matrix",
  "Modeled economics waterfall", "Six-month controlled pilot", "Eighteen-month scale and recurring-payments scenario"
]) if (!rentFlagship.includes(exhibit)) errors.push(`/use-cases/rent-as-a-utility-qatar: missing flagship exhibit ${exhibit}`);
count(rentFlagship, /<figure class="v3-exhibit v4-rent-exhibit/g, 12, "/use-cases/rent-as-a-utility-qatar", "rent flagship exhibits");
const rentWords = v3WordCount(rentFlagship);
if (rentWords < 2000 || rentWords > 3500) errors.push(`/use-cases/rent-as-a-utility-qatar: expected 2000-3500 report words, found ${rentWords}`);

for (const page of pages.filter(page => page.kind === "article")) {
  const html = await pageHtml(page.path);
  for (const marker of ["article-visual-stage", "visual-module", "article-lens"]) {
    if (!html.includes(marker)) errors.push(`${page.path}: missing article visual module ${marker}`);
  }
}

for (const [route, markers] of [
  ["/track-record/floward-oman", ["Floward Oman: operating chain", "Local setup", "Assortment", "Fulfilment", "Occasion trading", "Operating rhythm", "Technology and operating architecture"]],
  ["/track-record/salman-miraq", ["Salman Corporation / Miraq Lifestyle: operating chain", "Core diagnosis", "Stock and cash reset", "Portfolio choices", "Capital gates", "GCC options"]],
  ["/track-record/roumaan", ["Roumaan: operating chain", "Customer demand", "Curated catalogue", "Digital order", "Fulfilment", "Service learning"]],
  ["/track-record/upapp-factory", ["UpApp Factory: operating chain", "Qualified requirement", "Product design", "Development", "Deployment", "Support"]]
]) {
  const html = await pageHtml(route);
  for (const marker of markers) if (!html.includes(marker)) errors.push(`${route}: missing bespoke visual content ${marker}`);
}

const ai = await pageHtml("/ai-transformation");
for (const target of ["/ai-commerce", "/career-runway", "/use-cases/aeofind"]) {
  if (!ai.includes(`href="${target}"`)) errors.push(`AI & Transformation missing ${target}`);
}
for (const marker of ["v3-ai-ui-command", "v3-ai-ui-runway", "v3-ai-ui-aeo", "v3-agent-stack", "v3-authority-matrix", "v3-ai-delivery"]) {
  if (!ai.includes(marker)) errors.push(`AI & Transformation missing V3 module ${marker}`);
}
count(ai, /class="v4-ai-family-grid"/g, 1, "/ai-transformation", "AI operating-case family");
for (const item of aiOperatingCases) if (!ai.includes(`href="${item.href}"`)) errors.push(`AI & Transformation missing operating case ${item.href}`);

const useCasesIndex = await pageHtml("/use-cases");
count(useCasesIndex, /class="v3-library-entry/g, expandedLibraryCases.length, "/use-cases", "library entries");
for (const marker of ["case-filters", "data-sector=", "data-problem=", "data-solution=", "case-count", "reset-filters", 'href="/use-cases/leading-saudi-bank-commerce-ecosystem"']) {
  if (!useCasesIndex.includes(marker)) errors.push(`/use-cases: missing library capability ${marker}`);
}
for (const expected of ["Banking &amp; Fintech", "Telecom", "Retail &amp; Consumer", "Marketplaces", "Enterprise Technology", "Logistics", "New Ventures", "Customer Experience", "AI / Automation", "Operating Model"]) {
  if (!useCasesIndex.includes(expected)) errors.push(`/use-cases: missing normalized filter ${expected}`);
}
for (const tag of [...useCasesIndex.matchAll(/<a class="v3-library-entry"([^>]*)>/g)].map(match => match[1])) {
  const href = capture(tag, /href="([^"]+)"/);
  if (!href || href === "#" || href.startsWith("#")) errors.push(`/use-cases: public tile has missing or placeholder href`);
  else if (!routes.has(href)) errors.push(`/use-cases: public tile points to missing route ${href}`);
}
if (/\bHOLD\b|private case/i.test(useCasesIndex)) errors.push(`/use-cases: HOLD or private case rendered publicly`);

const aboutPage = await pageHtml("/about");
count(aboutPage, new RegExp(permittedRoleSentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), 1, "/about", "permitted current-role sentence");
count(home, new RegExp(permittedRoleSentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), 1, "/", "permitted current-role sentence");
count(trackIndex, new RegExp(permittedRoleSentence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), 1, "/track-record", "permitted current-role sentence");

const insightsIndex = await pageHtml("/insights");
count(insightsIndex, /class="v4-insight-card"/g, 8, "/insights", "editorial insight cards");
for (const marker of ["min read", "Read insight", "v4-insight-waterfall", "v4-insight-funnel", "v4-insight-bridge", "v4-insight-ladder", "v4-insight-architecture"]) {
  if (!insightsIndex.includes(marker)) errors.push(`/insights: missing editorial teaser element ${marker}`);
}
for (const [route, name, status] of [
  ["/ai-commerce", "AI Commerce Command Center", "In development"],
  ["/career-runway", "Career Runway AI", "Live"]
]) {
  const html = await pageHtml(route);
  for (const marker of [name, status]) if (!html.includes(marker)) errors.push(`${route}: missing ${marker}`);
  if (!html.includes('"@type":"SoftwareApplication"')) errors.push(`${route}: software schema missing`);
}

const robots = await readFile(join(root, "robots.txt"), "utf8");
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const llms = await readFile(join(root, "llms.txt"), "utf8");
const vercel = JSON.parse(await readFile(join(root, "..", "vercel.json"), "utf8"));
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) errors.push("robots: sitemap missing");
if (!llms.startsWith(`# ${site.name}`)) errors.push("llms.txt missing");
for (const route of routes) {
  if (route !== "/404" && !sitemap.includes(`${site.origin}${route === "/" ? "/" : route}`)) errors.push(`sitemap missing ${route}`);
}
for (const redirect of vercel.redirects || []) {
  if (!redirect.permanent) errors.push(`redirect not permanent: ${redirect.source}`);
  if (!routes.has(redirect.destination)) errors.push(`redirect destination missing: ${redirect.source} -> ${redirect.destination}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checks passed: ${htmlFiles.length} HTML files, ${routes.size - 1} indexable routes, 0 broken internal links, ${expandedLibraryCases.length} fully clickable public use cases, ${aiOperatingCases.length} AI operating cases and 8 insights.`);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]))).flat();
}
async function pageHtml(route) {
  return readFile(join(root, route.slice(1), "index.html"), "utf8");
}
function routeFor(file) {
  const rel = relative(root, file).replaceAll("\\", "/");
  return rel === "index.html" ? "/" : rel === "404.html" ? "/404" : `/${rel.replace(/\/index\.html$/, "")}`;
}
function count(html, regex, wanted, route, label) {
  const found = (html.match(regex) || []).length;
  if (found !== wanted) errors.push(`${route}: expected ${wanted} ${label}, found ${found}`);
}
function atLeast(value, regexOrMinimum, minimumOrRoute, routeOrLabel, maybeLabel) {
  if (typeof value === "number") {
    if (value < regexOrMinimum) errors.push(`${minimumOrRoute}: expected at least ${regexOrMinimum} ${routeOrLabel}, found ${value}`);
    return;
  }
  const found = (value.match(regexOrMinimum) || []).length;
  if (found < minimumOrRoute) errors.push(`${routeOrLabel}: expected at least ${minimumOrRoute} ${maybeLabel}, found ${found}`);
}
function reportWordCount(html) {
  const report = capture(html, /<article class="report-main">(.*?)<\/article>/s);
  return [...report.matchAll(/<p\b[^>]*>(.*?)<\/p>/gis)]
    .map(match => match[1])
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
function v3WordCount(html) {
  const main = capture(html, /<main id="main">(.*?)<\/main>/s);
  return [...main.matchAll(/<p\b[^>]*>(.*?)<\/p>/gis)]
    .map(match => match[1])
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
function capture(html, regex) { return (html.match(regex) || [])[1] || ""; }
function unique(map, value, route, label) {
  if (map.has(value)) errors.push(`${route}: duplicate ${label} with ${map.get(value)}`);
  else map.set(value, route);
}
