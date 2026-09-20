import { deepInsights } from "../../src/deep-insights.mjs";
import { SESSION_COOKIE, decryptSession, parseCookies } from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function articleHtml(item) {
  const sections = item.sections.map(section => {
    const paragraphs = section.paragraphs.map(p => `<p>${esc(p)}</p>`).join("");
    const bullets = section.bullets?.length
      ? `<ul>${section.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`
      : "";
    return `<h2>${esc(section.heading)}</h2>${paragraphs}${bullets}`;
  }).join("");

  const takeaways = item.takeaways?.length
    ? `<h2>Key takeaways</h2><ul>${item.takeaways.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`
    : "";

  const faq = item.faq?.length
    ? `<h2>Frequently asked questions</h2>${item.faq.map(x => `<h3>${esc(x.question)}</h3><p>${esc(x.answer)}</p>`).join("")}`
    : "";

  const sources = item.sources?.length
    ? `<h2>Sources and further reading</h2><ol>${item.sources.map(x => `<li><a href="${esc(x.url)}">${esc(x.title)}</a> — ${esc(x.publisher)}</li>`).join("")}</ol>`
    : "";

  return `<p><em>${esc(item.lead)}</em></p>${sections}${takeaways}${faq}${sources}`;
}

function plainFromHtml(html) {
  return html
    .replace(/<h2>(.*?)<\\/h2>/g, "\\n\\n$1\\n")
    .replace(/<h3>(.*?)<\\/h3>/g, "\\n\\n$1\\n")
    .replace(/<li>(.*?)<\\/li>/g, "• $1\\n")
    .replace(/<p>(.*?)<\\/p>/g, "$1\\n\\n")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\\n{3,}/g, "\\n\\n")
    .trim();
}

function buildArticles() {
  return deepInsights.slice(0, 3).map(item => {
    const html = articleHtml(item);
    const plain = plainFromHtml(html);
    return {
      id: item.slug,
      label: item.category,
      title: item.title,
      seoTitle: item.seoTitle || item.title,
      seoDescription: item.metaDescription,
      slug: item.slug,
      sourceUrl: `https://www.mharisaslam.com/insights/${item.slug}`,
      html,
      plain,
      wordCount: plain.split(/\\s+/).filter(Boolean).length,
      readMinutes: item.readMinutes || Math.max(6, Math.round(plain.split(/\\s+/).length / 200))
    };
  });
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
main{width:min(1180px,calc(100% - 32px));margin:34px auto 64px}
.top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:24px}
.eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--teal)}
h1{margin:8px 0 8px;font-size:34px;line-height:1.1;color:var(--navy)}.sub{margin:0;color:var(--muted);line-height:1.55}
.status{background:var(--wash);border-left:4px solid var(--teal);padding:14px 16px;min-width:290px;font-size:13px;line-height:1.5}
.grid{display:grid;grid-template-columns:390px minmax(0,1fr);gap:24px;align-items:start}
.card{background:var(--white);border:1px solid var(--line);padding:22px}
label{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin:0 0 7px;color:var(--navy)}
select,input,textarea{width:100%;border:1px solid #bfcac7;background:#fff;color:var(--ink);padding:11px;font:inherit}
.field{margin-bottom:16px}.meta{font-size:12px;color:var(--muted);line-height:1.5;margin-top:6px}
.row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
button,.linkbtn{border:0;background:var(--navy);color:#fff;padding:11px 13px;font-weight:800;font-size:13px;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}
.secondary{background:#fff;color:var(--navy);border:1px solid #aebbb7}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}
.guide{background:var(--warn);border:1px solid #ead69d;padding:15px;font-size:13px;line-height:1.55;margin-top:18px}
.guide strong{color:var(--navy)}
.article{background:#fff;border:1px solid var(--line);padding:38px 44px;line-height:1.75}
.article h2{font-size:24px;line-height:1.25;color:var(--navy);margin:34px 0 12px}
.article h3{font-size:18px;color:var(--navy);margin:26px 0 8px}
.article p{margin:0 0 16px}.article li{margin:7px 0}.article a{color:var(--teal)}
.article-title{font-size:36px;line-height:1.15;color:var(--navy);margin:0 0 18px}
.toolbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:12px;color:var(--muted);font-size:12px}
.notice{font-size:12px;color:var(--muted);line-height:1.5;margin-top:12px}
.copybox{position:absolute;left:-9999px;top:auto}
@media(max-width:900px){.grid{grid-template-columns:1fr}.top{display:block}.status{margin-top:16px}.article{padding:24px}.article-title{font-size:30px}}
</style>
</head>
<body>
<main>
<div class="top">
  <div><div class="eyebrow">Private native-article workspace</div><h1>Haris LinkedIn Article Studio</h1><p class="sub">Full long-form LinkedIn Articles, SEO fields and source-grounded copy. The article is rendered on the page even if JavaScript is blocked.</p></div>
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
      <div class="meta">LinkedIn: Manage → Settings → Article URL.</div>
    </div>
    <div class="field">
      <label>SEO title</label>
      <div class="row"><input id="seoTitle" value="${esc(selected.seoTitle)}" readonly><button type="button" onclick="copyField('seoTitle','SEO title')">Copy</button></div>
    </div>
    <div class="field">
      <label>SEO description</label>
      <div class="row"><textarea id="seoDescription" rows="4" readonly>${esc(selected.seoDescription)}</textarea><button type="button" onclick="copyField('seoDescription','SEO description')">Copy</button></div>
    </div>

    <textarea id="articlePlain" class="copybox" aria-hidden="true">${esc(selected.title + "\n\n" + selected.plain)}</textarea>
    <div class="actions">
      <button type="button" onclick="copyField('articlePlain','Full article')">Copy full article</button>
      <a class="linkbtn secondary" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">Open LinkedIn</a>
    </div>

    <div class="guide">
      <strong>Current reality</strong><br>
      LinkedIn does not expose native long-form Article creation through the member posting API. This studio prepares the complete article. For true end-to-end browser automation, use ChatGPT <b>Work</b> mode so it can operate LinkedIn's Article editor after your approval.
    </div>
    <p class="notice" id="copyStatus">Nothing is published from this page.</p>
  </section>

  <section>
    <div class="toolbar"><span>${selected.wordCount.toLocaleString()} words · ${selected.readMinutes} min read</span><span>Source: ${esc(selected.sourceUrl)}</span></div>
    <article class="article"><h1 class="article-title">${esc(selected.title)}</h1>${selected.html}</article>
  </section>
</div>
</main>
<script>
async function copyField(id,label){
  const el=document.getElementById(id);
  try{await navigator.clipboard.writeText(el.value);document.getElementById('copyStatus').textContent=label+' copied';}
  catch{el.focus();el.select();document.execCommand('copy');document.getElementById('copyStatus').textContent=label+' copied';}
}
</script>
</body></html>`;
}

export function GET(request) {
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
}
