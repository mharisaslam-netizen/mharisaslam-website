import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { navigation, pages, site } from "../src/v2-content.mjs";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const routes = new Set(htmlFiles.map(routeFor));
const errors = [];
const titles = new Map();
const descriptions = new Map();
const jobSignals = [
  /available for/i, /open to/i, /looking for (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /seeking (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /ceo roles?/i, /board roles?/i, /entrepreneur-in-residence/i, /\bEIR\b/i, /selected opportunities/i
];
const rejectedLanguage = [
  /what existed\s*\/\s*what was done/i, /how I would rebuild this in 2026/i,
  /the constraint behind the work/i, /the work is organized around operating problems/i,
  /2026 AI Rebuild/i, /executive rule/i, /decision model/i
];
const heldNames = /vodafone qatar|gcc telco marketplace blueprint|agentic-commerce operating design|current.employer/i;

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
    for (const [label, nav] of [["desktop",desktop],["mobile",mobile]]) {
      for (const [name, href] of navigation) if (!nav.includes(`href="${href}"`)) errors.push(`${route}: ${label} navigation missing ${name}`);
      if (nav.includes('href="/ventures"')) errors.push(`${route}: ${label} still has Ventures`);
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
  if (heldNames.test(html)) errors.push(`${route}: held/current-employer content`);
  for (const regex of jobSignals) if (regex.test(html)) errors.push(`${route}: job-seeking signal ${regex}`);
  for (const regex of rejectedLanguage) if (regex.test(html)) errors.push(`${route}: rejected language ${regex}`);
  if (html.includes("__bundler") || html.includes("Unpacking...")) errors.push(`${route}: unpacking shell`);
}

const home = await readFile(join(root,"index.html"),"utf8");
for (const sentence of [
  "Build businesses. Fix economics. Scale what works.",
  "GCC operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and AI."
]) if (!home.includes(sentence)) errors.push(`home missing required copy: ${sentence}`);
for (const heading of ["Selected operating record","Areas of work","Selected business problems","AI & Transformation","Insights","About","Contact"])
  if (!home.includes(heading)) errors.push(`home missing section ${heading}`);

const aiLab = await readFile(join(root,"ai-lab","index.html"),"utf8");
for (const [route,name,status] of [
  ["/ai-commerce","AI Commerce Command Center","In development"],
  ["/career-runway","Career Runway AI","Live"]
]) {
  if (!aiLab.includes(`href="${route}"`)) errors.push(`AI Lab card not linked to ${route}`);
  const html = await readFile(join(root,route.slice(1),"index.html"),"utf8");
  for (const marker of [name,status,"Business Problem","Solution","Technology","Commercial Model","Operating Model"])
    if (!html.includes(marker)) errors.push(`${route}: missing ${marker}`);
  if (!html.includes('"@type":"SoftwareApplication"')) errors.push(`${route}: software schema missing`);
}
const ai = await readFile(join(root,"ai-transformation","index.html"),"utf8");
if (!ai.includes('href="/ai-lab"') || !ai.includes('href="/ai-commerce"') || !ai.includes('href="/career-runway"'))
  errors.push("AI & Transformation: AI Lab/project links missing");
if (pages.filter(page => page.kind === "case").length !== 9) errors.push("release must have nine selected cases");
if (pages.filter(page => page.kind === "article").length !== 8) errors.push("release must have eight selected insights");
for (const page of pages.filter(page => page.kind === "case")) {
  const html = await readFile(join(root,page.path.slice(1),"index.html"),"utf8");
  for (const marker of ["Business Problem","Solution","Technology","Commercial Model","Operating Model",page.body.includes("Modeled Business Impact")?"Modeled Business Impact":"Business Impact"])
    if (!html.includes(marker)) errors.push(`${page.path}: missing case field ${marker}`);
}

const robots = await readFile(join(root,"robots.txt"),"utf8");
const sitemap = await readFile(join(root,"sitemap.xml"),"utf8");
const llms = await readFile(join(root,"llms.txt"),"utf8");
const vercel = JSON.parse(await readFile(join(root,"..","vercel.json"),"utf8"));
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) errors.push("robots: sitemap missing");
if (!llms.startsWith(`# ${site.name}`)) errors.push("llms.txt missing");
for (const route of routes) if (route !== "/404" && !sitemap.includes(`${site.origin}${route === "/" ? "/" : route}`)) errors.push(`sitemap missing ${route}`);
for (const redirect of vercel.redirects || []) {
  if (!redirect.permanent) errors.push(`redirect not permanent: ${redirect.source}`);
  if (!routes.has(redirect.destination)) errors.push(`redirect destination missing: ${redirect.source} -> ${redirect.destination}`);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Checks passed: ${htmlFiles.length} HTML files, ${routes.size - 1} indexable routes, 0 broken internal links.`);

async function walk(dir) {
  const entries = await readdir(dir,{withFileTypes:true});
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir,entry.name)) : [join(dir,entry.name)]))).flat();
}
function routeFor(file) {
  const rel = relative(root,file).replaceAll("\\","/");
  return rel === "index.html" ? "/" : rel === "404.html" ? "/404" : `/${rel.replace(/\/index\.html$/,"")}`;
}
function count(html,regex,wanted,route,label) {
  const found = (html.match(regex) || []).length;
  if (found !== wanted) errors.push(`${route}: expected ${wanted} ${label}, found ${found}`);
}
function capture(html,regex) { return (html.match(regex) || [])[1] || ""; }
function unique(map,value,route,label) {
  if (map.has(value)) errors.push(`${route}: duplicate ${label} with ${map.get(value)}`);
  else map.set(value,route);
}
