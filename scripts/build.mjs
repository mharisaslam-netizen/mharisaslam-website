import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { navigation, pages, site } from "../src/v2-content.mjs";
import { advisoryPage } from "../src/advisory-page.mjs";
import { executiveProfilePage } from "../src/executive-profile-page.mjs";

const allPages = [advisoryPage, executiveProfilePage, ...pages];
const primaryNavigation = [navigation[0], ["GCC Growth", advisoryPage.path], ...navigation.slice(1)];
const commercialBridgePaths = new Set(["/", "/about", "/track-record", "/use-cases", "/ai-transformation", "/insights"]);

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "dist");
await rm(out, { recursive: true, force: true });
await mkdir(join(out, "assets"), { recursive: true });
await cp(join(root, "src", "v2.css"), join(out, "assets", "site.css"));
await cp(join(root, "src", "v3-pilot.css"), join(out, "assets", "v3-pilot.css"));
await cp(join(root, "src", "v4-expansion.css"), join(out, "assets", "v4-expansion.css"));
await cp(join(root, "src", "pilot.css"), join(out, "assets", "pilot.css"));
try { await cp(join(root, "public", "assets"), join(out, "assets"), { recursive: true }); } catch {}
try { await cp(join(root, "public", "mharisaslam-indexnow-2026-7f3d9a4c2b8e6d1f.txt"), join(out, "mharisaslam-indexnow-2026-7f3d9a4c2b8e6d1f.txt")); } catch {}

for (const page of allPages) {
  const file = page.path === "/" ? join(out, "index.html") : join(out, page.path.slice(1), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, render(page), "utf8");
}

await writeFile(join(out, "404.html"), render404(), "utf8");
await writeFile(join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/linkedin/\n\nSitemap: ${site.origin}/sitemap.xml\n`, "utf8");
await writeFile(join(out, "sitemap.xml"), sitemap(), "utf8");
await writeFile(join(out, "llms.txt"), llmsTxt(), "utf8");

function render(page) {
  const url = `${site.origin}${page.path === "/" ? "/" : page.path}`;
  const crumbs = breadcrumbItems(page.path);
  const schema = schemaGraph(page, url, crumbs);
  const socialImage = page.ogImage || `${site.origin}/assets/og-card.png`;
  const socialImageAlt = page.ogImageAlt || "Muhammad Haris Aslam, operator, builder and transformation leader";
  return `<!doctype html>
<html lang="en">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-QW1VSXTK3G"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QW1VSXTK3G');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="msvalidate.01" content="D6BE1FF59A3DD423EC29CD8DDA9C2619">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${page.type === "ProfilePage" ? "profile" : page.type === "Article" ? "article" : "website"}">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="theme-color" content="${page.v3 ? "#f4f0e7" : page.pilot ? "#071821" : "#ffffff"}">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/v3-pilot.css">
  <link rel="stylesheet" href="/assets/v4-expansion.css">
  <link rel="stylesheet" href="/assets/pilot.css">
  <link rel="icon" href="/assets/favicon.png" type="image/png">
  <script type="application/ld+json">${safeJson(schema)}</script>
</head>
<body${page.v3 ? ` class="v3-page v3-${page.kind}"` : page.pilot ? ` class="pilot-page pilot-${page.kind}"` : ""}>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(page.path)}
  ${crumbs.length > 1 && !page.v3 && !page.pilot ? breadcrumbs(crumbs) : ""}
  <main id="main">
    ${page.v3 ? page.v3Body : page.pilot ? page.pilotBody : `<header class="hero${page.heroAside ? "" : " hero-single"}">
      <div class="hero-copy"><p class="eyebrow">${page.eyebrow}</p><h1>${page.h1}</h1><p class="hero-intro">${page.intro}</p></div>
      ${page.heroAside ? `<aside class="hero-aside">${page.heroAside}</aside>` : ""}
    </header>
    ${page.body}`}
  </main>
  ${commercialBridge(page.path)}
  ${advisoryConversion(page)}
  ${footer()}
</body>
</html>`;
}

function header(path) {
  const links = primaryNavigation.map(([label, href]) => `<a href="${href}"${current(path, href) ? ` aria-current="page"` : ""}>${label}</a>`).join("");
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="/" translate="no"><span class="brand-mark" aria-hidden="true">HA</span><span class="brand-name">Muhammad Haris Aslam</span></a><nav class="desktop-nav" aria-label="Primary">${links}</nav><details class="mobile-nav"><summary>Menu <span aria-hidden="true">☰</span></summary><nav class="mobile-panel" aria-label="Mobile">${links}</nav></details></div></header>`;
}
function commercialBridge(path) {
  if (!commercialBridgePaths.has(path)) return "";
  return `<section class="section" aria-labelledby="gcc-growth-bridge"><div class="section-heading"><p class="eyebrow">GCC growth & transformation</p><h2 id="gcc-growth-bridge">Turn a complex growth problem into an executable mandate.</h2></div><div class="report-prose"><p>For CEOs, founders, family businesses, boards and investors across Saudi Arabia, the UAE and the wider GCC, the operating lens connects growth, turnaround, digital commerce, AI, marketplaces, fintech, enterprise technology and market entry to commercial economics, ownership and execution.</p><p><strong>Priority operating models:</strong> <a href="/use-cases/saudi-market-entry-distribution">Saudi market entry</a> · <a href="/use-cases/payments-embedded-finance-growth">payments and embedded finance</a> · <a href="/use-cases/retail-group-transformation">retail transformation</a> · <a href="/use-cases/enterprise-ai-transformation-practice">enterprise AI transformation</a>.</p><p>For executive search firms, boards and investors assessing leadership fit, see the <a href="/gcc-executive-profile">GCC executive profile</a>.</p></div><div class="hero-actions"><a class="button" href="/gcc-growth-transformation">Explore GCC growth & transformation</a><a class="button button-secondary" href="/contact">Discuss a mandate</a></div></section>`;
}
function advisoryConversion(page) {
  if (page.kind !== "advisory") return "";
  return `<section class="section" aria-labelledby="advisory-contact"><div class="section-heading"><p class="eyebrow">Executive engagement</p><h2 id="advisory-contact">Discuss a high-consequence growth or transformation mandate.</h2></div><div class="report-prose"><p>The strongest fit is a cross-functional problem where commercial economics, operating ownership, technology and execution need to move together. Initial discussion can focus on the decision, value pool, evidence available and the operating questions that need to be resolved.</p></div><div class="hero-actions"><a class="button" href="/contact">Start a conversation</a><a class="button button-secondary" href="/track-record">Review operating evidence</a></div></section>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-top"><div class="footer-title">Muhammad Haris Aslam<br>GCC operator and business builder.</div><nav class="footer-links" aria-label="Explore"><p>Explore</p><a href="/gcc-growth-transformation">GCC Growth</a><a href="/gcc-executive-profile">Executive Profile</a><a href="/track-record">Track Record</a><a href="/use-cases">Use Cases</a><a href="/ai-transformation">AI & Transformation</a><a href="/insights">Insights</a></nav><nav class="footer-links" aria-label="Connect"><p>Connect</p><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="${site.linkedin}" rel="me noopener">LinkedIn</a><a href="mailto:${site.email}">${site.email}</a></nav></div><div class="footer-meta"><span>© ${new Date().getUTCFullYear()} ${site.name}</span><span>GCC operating experience</span></div></div></footer>`;
}
function render404() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${site.shortName}</title><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/assets/site.css"><link rel="icon" href="/assets/favicon.png" type="image/png"></head><body>${header("")}<main id="main" class="not-found"><p class="error-code">404 · PAGE NOT FOUND</p><h1>Page not found</h1><p>Try the homepage, GCC growth perspective, track record or use cases.</p><p><a class="button" href="/">Return home</a></p></main>${footer()}</body></html>`;
}
function breadcrumbItems(path) {
  if (path === "/") return [["Home", "/"]];
  if (path === "/ai-commerce" || path === "/career-runway") {
    const page = allPages.find(item => item.path === path);
    return [["Home", "/"], ["Use Cases", "/use-cases"], [page.h1, path]];
  }
  const parts = path.split("/").filter(Boolean); let acc = "";
  const hubLabels = { "/gcc-growth-transformation":"GCC Growth & Transformation", "/gcc-executive-profile":"Executive Profile", "/track-record":"Track Record", "/use-cases":"Use Cases", "/ai-transformation":"AI & Transformation", "/insights":"Insights" };
  return [["Home","/"], ...parts.map(p => { acc += `/${p}`; const page = allPages.find(item => item.path === acc); return page ? [page.path === path ? page.h1 : hubLabels[page.path] || page.h1, acc] : null; }).filter(Boolean)];
}
function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([name, href], i) => `<li>${i === items.length-1 ? `<span aria-current="page">${name}</span>` : `<a href="${href}">${name}</a>`}</li>`).join("")}</ol></nav>`;
}
function schemaGraph(page, url, crumbs) {
  const person = { "@type":"Person", "@id":`${site.origin}/#person`, name:site.name, url:`${site.origin}/about`, image:`${site.origin}/assets/haris-aslam.webp`, sameAs:[site.linkedin], jobTitle:"GCC operator and business builder", description:"Operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and applied AI.", knowsAbout:["Retail transformation","Marketplace operating models","Digital commerce","GCC growth","Family-business transformation","Venture building","Applied AI","Payments and logistics"] };
  const website = { "@type":"WebSite", "@id":`${site.origin}/#website`, url:`${site.origin}/`, name:site.name, publisher:{"@id":person["@id"]}, inLanguage:"en" };
  const webpage = { "@type":page.type === "Article" ? "WebPage" : page.type, "@id":`${url}#webpage`, url, name:page.title, description:page.description, isPartOf:{"@id":website["@id"]}, about:{"@id":person["@id"]}, inLanguage:"en", breadcrumb:{"@id":`${url}#breadcrumb`} };
  if (page.type === "ProfilePage") webpage.mainEntity = {"@id":person["@id"]};
  const breadcrumb = { "@type":"BreadcrumbList", "@id":`${url}#breadcrumb`, itemListElement:crumbs.map(([name, href], index) => ({"@type":"ListItem",position:index+1,name,item:`${site.origin}${href === "/" ? "/" : href}`})) };
  const graph = [person, website, webpage, breadcrumb];
  if (page.kind === "advisory") {
    const service = { "@type":"Service", "@id":`${url}#service`, name:"GCC Growth & Transformation Advisory", description:page.description, serviceType:"Growth, transformation and operating-model advisory", provider:{"@id":person["@id"]}, areaServed:["Saudi Arabia","United Arab Emirates","Qatar","Oman","Kuwait","Bahrain"].map(name => ({"@type":"Country",name})), url };
    webpage.mainEntity = {"@id":service["@id"]};
    graph.push(service);
  }
  if (page.service) {
    const service = { "@type":"Service", "@id":`${url}#service`, name:page.service.name, description:page.description, serviceType:page.service.serviceType, provider:{"@id":person["@id"]}, areaServed:page.service.areaServed.map(name => ({"@type":"Country",name})), url };
    webpage.mainEntity = {"@id":service["@id"]};
    graph.push(service);
  }
  if (page.faq?.length) {
    const faq = { "@type":"FAQPage", "@id":`${url}#faq`, mainEntity:page.faq.map(item => ({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}})) };
    webpage.hasPart = [...(webpage.hasPart || []), {"@id":faq["@id"]}];
    graph.push(faq);
  }
  if (page.project) {
    const software = { "@type":"SoftwareApplication", "@id":`${url}#software`, name:page.project.name, description:page.project.description, url, creativeWorkStatus:page.project.status, creator:{"@id":person["@id"]} };
    webpage.mainEntity = {"@id":software["@id"]};
    graph.push(software);
  }
  if (page.type === "Article") {
    const article = { "@type":"Article", "@id":`${url}#article`, headline:page.h1, datePublished:page.datePublished, description:page.description, image:{"@type":"ImageObject",url:page.ogImage || `${site.origin}/assets/og-card.png`,width:1200,height:675}, author:{"@id":person["@id"]}, publisher:{"@id":person["@id"]}, mainEntityOfPage:{"@id":webpage["@id"]} };
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
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages.map(p => `  <url><loc>${site.origin}${p.path === "/" ? "/" : p.path}</loc></url>`).join("\n")}\n</urlset>\n`;
}
function llmsTxt() {
  const links = allPages.map(p => `- [${pageLabel(p)}](${site.origin}${p.path === "/" ? "/" : p.path}): ${p.description}`).join("\n");
  return `# ${site.name}\n\n> GCC operator, business builder and transformation leader across commerce, retail, marketplaces, enterprise technology and AI.\n\n## GCC Growth & Transformation\n\n- [GCC Growth & Transformation](${site.origin}${advisoryPage.path}): ${advisoryPage.description}\n\n## Public pages\n\n${links}\n`;
}
function pageLabel(page) { return page.path === "/" ? "Home" : page.title.split("|")[0].trim(); }
function current(path, href) { return path === href || (href !== "/" && path.startsWith(`${href}/`)) || (href === "/use-cases" && ["/ai-commerce","/career-runway"].includes(path)); }
function safeJson(value) { return JSON.stringify(value).replaceAll("<", "\\u003c"); }
function escapeHtml(value) { return value.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
