import { deepInsights } from "../../src/deep-insights.mjs";
import { agenticCommerceArticle } from "../../lib/linkedin-articles.js";
import { SESSION_COOKIE, decryptSession, parseCookies } from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function articleHtml(item) {
  const sections = (item.sections || []).map((section, index) => {
    const paragraphs = (section.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("");
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`
      : "";
    const images = (item.inlineImages || [])
      .filter(image => image.afterSection === index + 1)
      .map(image => `<figure class="inline-visual"><img src="${esc(image.src)}" alt="${esc(image.alt)}"><figcaption>${esc(image.caption || "")}</figcaption></figure>`)
      .join("");
    return `<h2>${esc(section.heading)}</h2>${paragraphs}${bullets}${images}`;
  }).join("");

  const takeaways = item.takeaways?.length
    ? `<h2>Key takeaways</h2><ul>${item.takeaways.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`
    : "";

  const faq = item.faq?.length
    ? `<h2>Frequently asked questions</h2>${item.faq.map(x => `<h3>${esc(x.question)}</h3><p>${esc(x.answer)}</p>`).join("")}`
    : "";

  const sources = item.sources?.length
    ? `<h2>Sources and further reading</h2><ol>${item.sources.map(x => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a> — ${esc(x.publisher)}</li>`).join("")}</ol>`
    : "";

  return `<p class="lead"><em>${esc(item.lead || "")}</em></p>${sections}${takeaways}${faq}${sources}`;
}

function plainFromItem(item) {
  const parts = [];
  if (item.lead) parts.push(item.lead);

  for (const section of item.sections || []) {
    parts.push(section.heading || "");
    for (const paragraph of section.paragraphs || []) parts.push(paragraph);
    for (const bullet of section.bullets || []) parts.push(`• ${bullet}`);
  }

  if (item.takeaways?.length) {
    parts.push("Key takeaways");
    for (const x of item.takeaways) parts.push(`• ${x}`);
  }

  if (item.faq?.length) {
    parts.push("Frequently asked questions");
    for (const x of item.faq) {
      parts.push(x.question);
      parts.push(x.answer);
    }
  }

  if (item.sources?.length) {
    parts.push("Sources and further reading");
    for (const x of item.sources) parts.push(`${x.title} — ${x.publisher}: ${x.url}`);
  }

  return parts.filter(Boolean).join("\n\n").trim();
}

function normalize(item, overrides = {}) {
  const plain = plainFromItem(item);
  return {
    id: item.slug,
    label: item.category || "LinkedIn Article",
    title: item.title,
    seoTitle: item.seoTitle || item.title,
    seoDescription: item.metaDescription || "",
    slug: item.slug,
    sourceUrl: overrides.sourceUrl || `https://www.mharisaslam.com/insights/${item.slug}`,
    heroImage: overrides.heroImage || item.heroImage || "",
    heroAlt: overrides.heroAlt || item.heroAlt || item.title,
    heroCaption: item.heroCaption || "",
    inlineImages: item.inlineImages || [],
    html: articleHtml(item),
    plain,
    wordCount: plain.split(/\s+/).filter(Boolean).length,
    readMinutes: item.readMinutes || Math.max(5, Math.round(plain.split(/\s+/).filter(Boolean).length / 200))
  };
}

function buildArticles() {
  const marketplace = deepInsights.find(x => x.slug === "marketplace-economics-gmv-revenue-contribution-gcc");
  const articles = [
    normalize(agenticCommerceArticle, {
      sourceUrl: "https://www.mharisaslam.com/insights/fintech-agentic-commerce-ai-agents-moving-money"
    })
  ];

  if (marketplace) {
    articles.push(normalize(marketplace));
  }

  return articles;
}

function page(session, articles, selected) {
  const expiry = new Date(session.expiresAt).toLocaleString("en-GB", {
    timeZone: "Asia/Qatar",
    dateStyle: "medium",
    timeStyle: "short"
  });
  const options = articles.map(a => `<option value="${esc(a.id)}"${a.id === selected.id ? " selected" : ""}>${esc(a.label)} — ${esc(a.title)}</option>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Haris LinkedIn Article Studio</title>
<style>
:root{--navy:#0c2630;--ink:#173039;--teal:#0b857d;--line:#d7dfdc;--paper:#f4f0e7;--white:#fff;--muted:#63777d;--wash:#e7f2ef;--warn:#fff6dc}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif}
main{width:min(1240px,calc(100% - 32px));margin:34px auto 64px}
.top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:24px}
.eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--teal)}
h1{margin:8px 0 8px;font-size:34px;line-height:1.1;color:var(--navy)}.sub{margin:0;color:var(--muted);line-height:1.55;max-width:760px}
.status{background:var(--wash);border-left:4px solid var(--teal);padding:14px 16px;min-width:290px;font-size:13px;line-height:1.5}
.grid{display:grid;grid-template-columns:390px minmax(0,1fr);gap:24px;align-items:start}
.card{background:var(--white);border:1px solid var(--line);padding:22px;position:sticky;top:20px}
label{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin:0 0 7px;color:var(--navy)}
select,input,textarea{width:100%;border:1px solid #bfcac7;background:#fff;color:var(--ink);padding:11px;font:inherit}
.field{margin-bottom:16px}.meta{font-size:12px;color:var(--muted);line-height:1.5;margin-top:6px}
.row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
button,.linkbtn{border:0;background:var(--navy);color:#fff;padding:11px 13px;font-weight:800;font-size:13px;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}
.secondary{background:#fff;color:var(--navy);border:1px solid #aebbb7}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}
.guide{background:var(--warn);border:1px solid #ead69d;padding:15px;font-size:13px;line-height:1.55;margin-top:18px}
.guide strong{color:var(--navy)}
.article{background:#fff;border:1px solid var(--line);padding:0 46px 44px;line-height:1.75;overflow:hidden}
.hero{width:calc(100% + 92px);margin-left:-46px;height:auto;max-height:470px;object-fit:cover;display:block;margin-bottom:12px}
.hero-caption{margin:0 0 34px;color:var(--muted);font-size:12px;line-height:1.5}
.inline-visual{margin:30px 0 34px;border:1px solid var(--line);background:#fafafa}
.inline-visual img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
.inline-visual figcaption{padding:10px 12px;color:var(--muted);font-size:12px;line-height:1.5}
.article-approval{display:flex;gap:9px;align-items:flex-start;margin:18px 0 10px;padding:13px;background:var(--warn);border:1px solid #ead69d;font-size:12px;line-height:1.5}
.linkbtn.disabled{opacity:.42;pointer-events:none;cursor:not-allowed}
.article h2{font-size:24px;line-height:1.25;color:var(--navy);margin:36px 0 12px}
.article h3{font-size:18px;color:var(--navy);margin:26px 0 8px}
.article p{margin:0 0 16px}.article li{margin:7px 0}.article a{color:var(--teal);word-break:break-word}
.article-title{font-size:38px;line-height:1.13;color:var(--navy);margin:0 0 18px}
.lead{font-size:18px;line-height:1.6;color:#496068}
.toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px;color:var(--muted);font-size:12px}
.notice{font-size:12px;color:var(--muted);line-height:1.5;margin-top:12px}
.copybox{position:absolute;left:-9999px;top:auto}
.backlink{display:inline-block;margin-top:12px;color:var(--teal);font-weight:700;text-decoration:none;font-size:13px}
@media(max-width:900px){.grid{grid-template-columns:1fr}.top{display:block}.status{margin-top:16px}.card{position:static}.article{padding:0 24px 30px}.hero{width:calc(100% + 48px);margin-left:-24px;margin-bottom:26px}.article-title{font-size:30px}}
</style>
</head>
<body>
<main>
<div class="top">
  <div><div class="eyebrow">Private native-article workspace</div><h1>Haris LinkedIn Article Studio</h1><p class="sub">Two authority pieces prepared for native LinkedIn publishing: Marketplace Economics and Fintech × Agentic Commerce. Full copy, cover image, SEO fields and sources are kept together here.</p><a class="backlink" href="/api/linkedin/publisher">← Daily Post Publisher</a></div>
  <div class="status"><strong>LinkedIn identity verified</strong><br>${esc(session.name || "Muhammad Haris Aslam")}<br>Connection expires ${esc(expiry)} Qatar time.</div>
</div>

<div class="grid">
  <section class="card">
    <form method="get" action="/api/linkedin/article-studio" class="field">
      <label for="articlePicker">Article</label>
      <div class="row"><select id="articlePicker" name="article">${options}</select><button type="submit">Load</button></div>
    </form>

    <div class="field">
      <label>LinkedIn article title</label>
      <div class="row"><input id="title" value="${esc(selected.title)}" readonly><button type="button" onclick="copyField('title','Title')">Copy</button></div>
    </div>
    <div class="field">
      <label>Suggested LinkedIn article URL</label>
      <div class="row"><input id="slug" value="${esc(selected.slug)}" readonly><button type="button" onclick="copyField('slug','Article URL')">Copy</button></div>
    </div>
    <div class="field">
      <label>SEO title</label>
      <div class="row"><input id="seoTitle" value="${esc(selected.seoTitle)}" readonly><button type="button" onclick="copyField('seoTitle','SEO title')">Copy</button></div>
    </div>
    <div class="field">
      <label>SEO description</label>
      <div class="row"><textarea id="seoDescription" rows="4" readonly>${esc(selected.seoDescription)}</textarea><button type="button" onclick="copyField('seoDescription','SEO description')">Copy</button></div>
    </div>
    <div class="field">
      <label>Cover image</label>
      <input id="heroImage" value="${esc(selected.heroImage)}" readonly>
    </div>

    <textarea id="articlePlain" class="copybox" aria-hidden="true">${esc(selected.title + "\n\n" + selected.plain)}</textarea>
    <div class="actions">
      <button type="button" onclick="copyField('articlePlain','Full article')">Copy full article</button>
      <button type="button" onclick="copyField('heroImage','Cover image URL')">Copy cover image</button>
    </div>
    <label class="article-approval"><input type="checkbox" id="articleApprove"> <span>I approve this exact article and its visual assets for final native LinkedIn Article publishing.</span></label>
    <a id="openLinkedInArticle" class="linkbtn secondary disabled" href="https://www.linkedin.com/article/new/" target="_blank" rel="noopener noreferrer" aria-disabled="true">Open LinkedIn Article Editor</a>

    <div class="guide">
      <strong>Publishing workflow</strong><br>
      Native LinkedIn Articles still require LinkedIn's Article editor. This Studio is the review and approval gate. Nothing publishes from here. After approval, the native editor is used for the final article, and no separate promotional feed post is created unless you explicitly request one.
    </div>
    <p class="notice" id="copyStatus">Nothing is published from this page.</p>
  </section>

  <section>
    <div class="toolbar"><span>${selected.wordCount.toLocaleString()} words · ${selected.readMinutes} min read</span><span>${esc(selected.label)}</span></div>
    <article class="article">
      ${selected.heroImage ? `<img class="hero" src="${esc(selected.heroImage)}" alt="${esc(selected.heroAlt)}"><p class="hero-caption">${esc(selected.heroCaption || "")}</p>` : ""}
      <h1 class="article-title">${esc(selected.title)}</h1>
      ${selected.html}
    </article>
  </section>
</div>
</main>
<script>
const articleApprove=document.getElementById("articleApprove");
const openArticle=document.getElementById("openLinkedInArticle");
articleApprove?.addEventListener("change",()=>{
  const approved=articleApprove.checked;
  openArticle.classList.toggle("disabled",!approved);
  openArticle.setAttribute("aria-disabled",approved?"false":"true");
  document.getElementById("copyStatus").textContent=approved
    ? "Article approved for final native LinkedIn publishing."
    : "Article approval reset. Nothing will be published.";
});
async function copyField(id,label){
  const el=document.getElementById(id);
  try{await navigator.clipboard.writeText(el.value);document.getElementById("copyStatus").textContent=label+" copied";}
  catch{el.focus();el.select();document.execCommand("copy");document.getElementById("copyStatus").textContent=label+" copied";}
}
</script>
</body></html>`;
}

export function GET(request) {
  try {
    const secret = process.env.LINKEDIN_SESSION_SECRET;
    const cookies = parseCookies(request.headers.get("cookie") || "");
    const session = secret ? decryptSession(cookies[SESSION_COOKIE], secret) : null;
    const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());

    if (!connected) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/api/linkedin/connect",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow, noarchive"
        }
      });
    }

    const articles = buildArticles();
    if (!articles.length) throw new Error("No LinkedIn articles are configured");

    const requestedId = new URL(request.url).searchParams.get("article");
    const selected = articles.find(a => a.id === requestedId) || articles[0];

    return new Response(page(session, articles, selected), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    });
  } catch (error) {
    console.error("LinkedIn Article Studio error", error);
    return new Response(
      "<!doctype html><html><head><meta charset='utf-8'><meta name='robots' content='noindex,nofollow,noarchive'><title>Article Studio error</title></head><body style='font-family:Arial;padding:40px'><h1>Article Studio could not load</h1><p>The function returned a controlled error instead of crashing. Please use the daily publisher while the article data is checked.</p></body></html>",
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow,noarchive"
        }
      }
    );
  }
}
