import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { navigation, pages, site } from "../src/v2-content.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(join(out, "assets"), { recursive: true });
await cp(join(root, "src", "v2.css"), join(out, "assets", "site.css"));
try { await cp(join(root, "public", "assets"), join(out, "assets"), { recursive: true }); } catch {}

for (const page of pages) {
  const file = page.path === "/" ? join(out, "index.html") : join(out, page.path.slice(1), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render(page), "utf8");
}

await writeFile(join(out, "404.html"), render404(), "utf8");
await writeFile(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`, "utf8");
await writeFile(join(out, "sitemap.xml"), sitemap(), "utf8");
await writeFile(join(out, "llms.txt"), llmsTxt(), "utf8");

function render(page) {
  const url = `${site.origin}${page.path === "/" ? "/" : page.path}`;
  const crumbs = breadcrumbItems(page.path);
  const schema = schemaGraph(page, url, crumbs);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${page.type === "ProfilePage" ? "profile" : page.type === "Article" ? "article" : "website"}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.origin}/assets/og-card.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Muhammad Haris Aslam — operator, builder and transformation leader">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${site.origin}/assets/og-card.png">
  <meta name="theme-color" content="#101c21">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <script type="application/ld+json">${safeJson(schema)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(page.path)}
  ${crumbs.length > 1 ? breadcrumbs(crumbs) : ""}
  <main id="main">
    <header class="hero">
      <div class="hero-copy"><p class="eyebrow">${page.eyebrow}</p><h1>${page.h1}</h1><p class="hero-intro">${page.intro}</p></div>
      <aside class="hero-aside">${page.heroAside || `<div class="hero-context"><span>Operator perspective</span><strong>Business problem → economics → operating model</strong><p>Data, technology and AI follow the commercial decision.</p></div>`}</aside>
    </header>
    ${page.body}
  </main>
  ${footer()}
</body>
</html>`;
}

function header(path) {
  const links = navigation.map(([label, href]) => `<a href="${href}"${current(path, href) ? ` aria-current="page"` : ""}>${label}</a>`).join("");
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="/" translate="no"><span class="brand-mark" aria-hidden="true">HA</span><span class="brand-name">Muhammad Haris Aslam</span></a><nav class="desktop-nav" aria-label="Primary">${links}<a class="nav-subsection" href="/ai-lab">AI Lab</a></nav><details class="mobile-nav"><summary>Menu <span aria-hidden="true">☰</span></summary><nav class="mobile-panel" aria-label="Mobile">${links}<a href="/ai-lab">AI Lab</a></nav></details></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-top"><div class="footer-title">Build businesses. Fix economics. Redesign the operating model.</div><nav class="footer-links" aria-label="Explore"><p>Explore</p><a href="/work">Work</a><a href="/ai-transformation">AI & Transformation</a><a href="/ventures">Ventures</a><a href="/insights">Insights</a><a href="/ai-lab">AI Lab</a></nav><nav class="footer-links" aria-label="Connect"><p>Connect</p><a href="/about">About</a><a href="/contact">Contact</a><a href="${site.linkedin}" rel="me noopener">LinkedIn</a><a href="mailto:${site.email}">${site.email}</a></nav></div><div class="footer-meta"><span>© ${new Date().getUTCFullYear()} ${site.name}</span><span>Doha-based · GCC operating experience</span></div></div></footer>`;
}
function render404() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${site.shortName}</title><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/assets/site.css"><link rel="icon" href="/assets/favicon.png" type="image/png"></head><body>${header("")}<main id="main" class="not-found"><p class="error-code">404 · PAGE NOT FOUND</p><h1>This route has moved on.</h1><p>The page may have been replaced as part of the site's clean-URL rebuild.</p><p><a class="button nav-cta" href="/">Return to the homepage</a></p></main>${footer()}</body></html>`;
}
function breadcrumbItems(path) {
  if (path === "/") return [["Home", "/"]];
  if (path === "/ai-commerce" || path === "/career-runway") {
    const page = pages.find(item => item.path === path);
    return [["Home", "/"], ["AI Lab", "/ai-lab"], [page.h1, path]];
  }
  const parts = path.split("/").filter(Boolean); let acc = "";
  return [["Home","/"], ...parts.map(p => { acc += `/${p}`; const page = pages.find(item => item.path === acc); return page ? [page.path === path ? page.h1 : page.path === "/work/cases" ? "Cases" : page.path === "/work/blueprints" ? "Blueprints" : page.h1, acc] : null; }).filter(Boolean)];
}
function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([name, href], i) => `<li>${i === items.length-1 ? `<span aria-current="page">${name}</span>` : `<a href="${href}">${name}</a>`}</li>`).join("")}</ol></nav>`;
}
function schemaGraph(page, url, crumbs) {
  const person = { "@type":"Person", "@id":`${site.origin}/#person`, name:site.name, url:`${site.origin}/about`, image:`${site.origin}/assets/haris-aslam.webp`, sameAs:[site.linkedin], jobTitle:"Digital-commerce operator and builder", description:"GCC operator and transformation leader across commerce, retail, marketplaces, venture building and applied AI.", knowsAbout:["Retail transformation","Marketplace operating models","Digital commerce","GCC growth","Family-business transformation","Venture building","AI-enabled commerce","Payments and logistics"], homeLocation:{"@type":"Place",name:"Doha, Qatar"} };
  const website = { "@type":"WebSite", "@id":`${site.origin}/#website`, url:`${site.origin}/`, name:site.name, publisher:{"@id":person["@id"]}, inLanguage:"en" };
  const webpage = { "@type":page.type === "Article" ? "WebPage" : page.type, "@id":`${url}#webpage`, url, name:page.title, description:page.description, isPartOf:{"@id":website["@id"]}, about:{"@id":person["@id"]}, inLanguage:"en", breadcrumb:{"@id":`${url}#breadcrumb`} };
  if (page.type === "ProfilePage") webpage.mainEntity = {"@id":person["@id"]};
  const breadcrumb = { "@type":"BreadcrumbList", "@id":`${url}#breadcrumb`, itemListElement:crumbs.map(([name, href], index) => ({"@type":"ListItem",position:index+1,name,item:`${site.origin}${href === "/" ? "/" : href}`})) };
  const graph = [person, website, webpage, breadcrumb];
  if (page.project) {
    const software = { "@type":"SoftwareApplication", "@id":`${url}#software`, name:page.project.name, description:page.project.description, url, creativeWorkStatus:page.project.status, creator:{"@id":person["@id"]} };
    webpage.mainEntity = {"@id":software["@id"]};
    graph.push(software);
  }
  if (page.type === "Article") {
    const article = { "@type":"Article", "@id":`${url}#article`, headline:page.h1, datePublished:page.datePublished, description:page.description, author:{"@id":person["@id"]}, mainEntityOfPage:{"@id":webpage["@id"]} };
    graph.push(article);
  }
  if (page.kind === "case" && !page.project) {
    const work = { "@type":"CreativeWork", "@id":`${url}#case`, name:page.h1, description:page.description, author:{"@id":person["@id"]}, mainEntityOfPage:{"@id":webpage["@id"]} };
    webpage.mainEntity = {"@id":work["@id"]};
    graph.push(work);
  }
  return { "@context":"https://schema.org", "@graph":graph };
}
function sitemap() {
  const date = new Date().toISOString().slice(0,10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${site.origin}${p.path === "/" ? "/" : p.path}</loc><lastmod>${date}</lastmod></url>`).join("\n")}\n</urlset>\n`;
}
function llmsTxt() {
  const links = pages.map(p => `- [${pageLabel(p)}](${site.origin}${p.path === "/" ? "/" : p.path}): ${p.description}`).join("\n");
  return `# ${site.name}\n\n> Operator, builder and transformation leader across GCC commerce, retail, marketplaces, fintech, enterprise technology and AI.\n\n## Public pages\n\n${links}\n`;
}
function pageLabel(page) { return page.path === "/" ? "Home" : page.title.split("|")[0].trim(); }
function current(path, href) { return path === href || (href !== "/" && path.startsWith(`${href}/`)) || (href === "/ai-transformation" && ["/ai-lab","/ai-commerce","/career-runway"].includes(path)); }
function safeJson(value) { return JSON.stringify(value).replaceAll("<", "\\u003c"); }
function escapeHtml(value) { return value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
