import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const files = await walk(root);
const htmlFiles = files.filter(f => f.endsWith(".html"));
const routeMap = new Set(htmlFiles.map(f => {
  const rel = relative(root, f).replaceAll("\\", "/");
  return rel === "index.html" ? "/" : rel === "404.html" ? "/404" : `/${rel.replace(/\/index\.html$/, "")}`;
}));
const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const jobSeekingSignals = [
  /available for/i,
  /open to/i,
  /looking for (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /seeking (?:an?|the|my|selected)?\s*(?:ceo|executive|leadership|board|role|position|opportunit)/i,
  /ceo roles?/i,
  /board roles?/i,
  /entrepreneur-in-residence/i,
  /\bEIR\b/,
  /selected opportunities/i,
  /selected leadership[^.]{0,80}conversations/i
];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const route = routeFor(file);
  if (route !== "/404") {
    requireCount(html, /<html lang="en">/gi, 1, route, "English language declaration");
    requireCount(html, /<meta name="viewport"/gi, 1, route, "viewport");
    requireCount(html, /<main id="main">/gi, 1, route, "main landmark");
    requireCount(html, /class="skip-link"/gi, 1, route, "skip link");
    requireCount(html, /<h1\b/gi, 1, route, "H1");
    requireCount(html, /<title>/gi, 1, route, "title");
    requireCount(html, /rel="canonical"/gi, 1, route, "canonical");
    requireCount(html, /name="description"/gi, 1, route, "description");
    requireCount(html, /application\/ld\+json/gi, 1, route, "JSON-LD");
    const title = capture(html, /<title>(.*?)<\/title>/s);
    const desc = capture(html, /<meta name="description" content="(.*?)">/s);
    const canonical = capture(html, /<link rel="canonical" href="(.*?)">/s);
    if (title.length > 65) errors.push(`${route}: title is ${title.length} characters`);
    if (desc.length > 165 || desc.length < 110) errors.push(`${route}: description is ${desc.length} characters`);
    if (!canonical.endsWith(route === "/" ? "/" : route)) errors.push(`${route}: canonical mismatch ${canonical}`);
    duplicate(seenTitles, title, route, "title"); duplicate(seenDescriptions, desc, route, "description");
    for (const href of [...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1])) {
      if (href.startsWith("/assets/")) {
        try { await stat(join(root, href)); } catch { errors.push(`${route}: missing asset ${href}`); }
      } else if (!routeMap.has(href) && href !== "/404") errors.push(`${route}: broken internal link ${href}`);
    }
    for (const script of [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]) {
      try { JSON.parse(script[1]); } catch (e) { errors.push(`${route}: invalid JSON-LD ${e.message}`); }
    }
    for (const image of [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0])) {
      if (!/\balt="[^"]*"/.test(image)) errors.push(`${route}: image missing alt text`);
      if (!/\bwidth="\d+"/.test(image) || !/\bheight="\d+"/.test(image)) errors.push(`${route}: image missing dimensions`);
    }
    const desktopNav = capture(html, /<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/s);
    const mobileNav = capture(html, /<nav class="mobile-panel"[^>]*>(.*?)<\/nav>/s);
    for (const [label, nav] of [["desktop", desktopNav], ["mobile", mobileNav]]) {
      if (!nav.includes('href="/ai-lab"')) errors.push(`${route}: ${label} navigation is missing AI Lab`);
      if (!nav.includes('href="/ventures-eir"')) errors.push(`${route}: ${label} navigation is missing Ventures & AI`);
    }
  }
  if (html.includes("__bundler") || html.includes("Unpacking...")) errors.push(`${route}: legacy unpacking shell detected`);
  for (const signal of jobSeekingSignals) if (signal.test(html)) errors.push(`${route}: job-seeking signal detected (${signal})`);
}

const robots = await readFile(join(root,"robots.txt"),"utf8");
const sitemap = await readFile(join(root,"sitemap.xml"),"utf8");
const vercel = JSON.parse(await readFile(join(root,"..","vercel.json"),"utf8"));
const aiLab = await readFile(join(root,"ai-lab","index.html"),"utf8");
for (const required of ["AI Commerce Command Center", "Career Runway AI", "In development", "Live", "Business problem"]) {
  if (!aiLab.includes(required)) errors.push(`AI Lab: missing restored project content (${required})`);
}
const projectPages = [
  { route:"ai-commerce", href:"/ai-commerce", name:"AI Commerce Command Center", status:"In development", category:"Agentic · Commerce", description:"A full commerce operation — catalog, orders, care, sellers, inventory, pricing and finance — run on lean resources by coordinated AI agents under human approval." },
  { route:"career-runway", href:"/career-runway", name:"Career Runway AI", status:"Live", category:"Career · Fintech", description:"Helps professionals stuck in corporate life read their Career DNA and their real financial runway — grounded in their own numbers — before they leap." }
];
for (const project of projectPages) {
  const html = await readFile(join(root,project.route,"index.html"),"utf8");
  if (!aiLab.includes(`class="case project project-link" href="${project.href}"`)) errors.push(`AI Lab: project card is not linked to ${project.href}`);
  for (const required of [project.name, project.status, project.category, project.description, "Business problem", '"@type":"SoftwareApplication"']) {
    if (!html.includes(required)) errors.push(`${project.href}: missing verified project content (${required})`);
  }
}
if (!robots.includes("Sitemap: https://www.mharisaslam.com/sitemap.xml")) errors.push("robots.txt: sitemap missing");
for (const route of [...routeMap].filter(r => r !== "/404")) if (!sitemap.includes(`https://www.mharisaslam.com${route === "/" ? "/" : route}`)) errors.push(`sitemap: missing ${route}`);
for (const redirect of vercel.redirects || []) {
  if (!redirect.permanent) errors.push(`redirect is not permanent: ${redirect.source}`);
  if (!routeMap.has(redirect.destination)) errors.push(`redirect destination does not exist: ${redirect.source} -> ${redirect.destination}`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`SEO checks passed: ${htmlFiles.length} HTML files, ${routeMap.size-1} indexable routes, 0 broken internal links.`);

async function walk(dir) { return (await readdir(dir,{withFileTypes:true})).flatMap(e => e.isDirectory() ? [] : [join(dir,e.name)]).concat(...await Promise.all((await readdir(dir,{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>walk(join(dir,e.name))))); }
function routeFor(file) { const rel=relative(root,file).replaceAll("\\","/"); return rel==="index.html"?"/":rel==="404.html"?"/404":`/${rel.replace(/\/index\.html$/,"")}`; }
function requireCount(html,re,n,route,label){ const c=(html.match(re)||[]).length; if(c!==n)errors.push(`${route}: expected ${n} ${label}, found ${c}`); }
function capture(html,re){ return (html.match(re)||[])[1]||""; }
function duplicate(map,value,route,label){ if(map.has(value))errors.push(`${route}: duplicate ${label} with ${map.get(value)}`); else map.set(value,route); }
