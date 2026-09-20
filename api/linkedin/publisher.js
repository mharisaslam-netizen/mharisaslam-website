import { deepInsights } from "../../src/deep-insights.mjs";
import { SESSION_COOKIE, decryptSession, parseCookies } from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function jsonForScript(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

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
    .replace(/<h2>(.*?)<\/h2>/g, "\n\n$1\n")
    .replace(/<h3>(.*?)<\/h3>/g, "\n\n$1\n")
    .replace(/<li>(.*?)<\/li>/g, "• $1\n")
    .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const articles = deepInsights.slice(0, 3).map(item => {
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
    wordCount: plain.split(/\s+/).filter(Boolean).length,
    readMinutes: item.readMinutes || Math.max(6, Math.round(plain.split(/\s+/).length / 200))
  };
});

function page(session) {
  const data = jsonForScript(articles);
  const first = articles[0];
  const expiry = new Date(session.expiresAt).toLocaleString("en-GB", { timeZone: "Asia/Qatar", dateStyle: "medium", timeStyle: "short" });

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
@media(max-width:900px){.grid{grid-template-columns:1fr}.top{display:block}.status{margin-top:16px}.article{padding:24px}.article-title{font-size:30px}}
</style>
</head>
<body>
<main>
<div class="top">
  <div><div class="eyebrow">Private native-article workspace</div><h1>Haris LinkedIn Article Studio</h1><p class="sub">Prepare full LinkedIn Articles for your Articles area. This workspace does not publish feed posts.</p></div>
  <div class="status"><strong>LinkedIn identity verified</strong><br>${esc(session.name || "Muhammad Haris Aslam")}<br>Connection expires ${esc(expiry)} Qatar time.</div>
</div>

<div class="grid">
  <section class="card">
    <div class="field"><label for="articlePicker">Article</label><select id="articlePicker"></select></div>

    <div class="field">
      <label>LinkedIn article title</label>
      <div class="row"><input id="title" readonly><button type="button" data-copy="title">Copy</button></div>
    </div>

    <div class="field">
      <label>Suggested LinkedIn article URL</label>
      <div class="row"><input id="slug" readonly><button type="button" data-copy="slug">Copy</button></div>
      <div class="meta">Set this inside LinkedIn: Manage → Settings → Article URL.</div>
    </div>

    <div class="field">
      <label>SEO title</label>
      <div class="row"><input id="seoTitle" readonly><button type="button" data-copy="seoTitle">Copy</button></div>
    </div>

    <div class="field">
      <label>SEO description</label>
      <div class="row"><textarea id="seoDescription" rows="4" readonly></textarea><button type="button" data-copy="seoDescription">Copy</button></div>
    </div>

    <div class="actions">
      <button type="button" id="copyArticle">Copy full article</button>
      <a class="linkbtn secondary" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">Open LinkedIn</a>
    </div>

    <div class="guide">
      <strong>Publishing flow</strong><br>
      1. Open LinkedIn on desktop and click <b>Write article</b>.<br>
      2. Publish as <b>yourself</b> and choose <b>Individual article</b>.<br>
      3. Add the cover image, paste the title, then paste the full article.<br>
      4. Open <b>Manage → Settings</b> and paste the Article URL, SEO title and SEO description from here.<br>
      5. Click <b>Next</b>. Leave “Tell your network what your article is about” blank if you do not want a separate commentary post.<br>
      6. Publish the article.
    </div>
    <p class="notice">LinkedIn may still distribute the article itself in Activity or feed recommendations. This workflow avoids creating a separate feed post/commentary.</p>
  </section>

  <section>
    <div class="toolbar"><span id="stats"></span><span id="copyStatus"></span></div>
    <article class="article"><h1 class="article-title" id="previewTitle"></h1><div id="articleBody"></div></article>
  </section>
</div>
</main>

<script>
const articles=${data};
const picker=document.getElementById("articlePicker");
const title=document.getElementById("title");
const slug=document.getElementById("slug");
const seoTitle=document.getElementById("seoTitle");
const seoDescription=document.getElementById("seoDescription");
const previewTitle=document.getElementById("previewTitle");
const articleBody=document.getElementById("articleBody");
const stats=document.getElementById("stats");
const copyStatus=document.getElementById("copyStatus");

for(const article of articles){
  const o=document.createElement("option");
  o.value=article.id;
  o.textContent=article.label+" — "+article.title;
  picker.appendChild(o);
}

function current(){return articles.find(x=>x.id===picker.value)||articles[0]}
function render(){
  const a=current();
  title.value=a.title;
  slug.value=a.slug;
  seoTitle.value=a.seoTitle;
  seoDescription.value=a.seoDescription;
  previewTitle.textContent=a.title;
  articleBody.innerHTML=a.html;
  stats.textContent=a.wordCount.toLocaleString()+" words · "+a.readMinutes+" min read";
  copyStatus.textContent="";
}
async function copyText(value,label){
  await navigator.clipboard.writeText(value);
  copyStatus.textContent=label+" copied";
}
document.querySelectorAll("[data-copy]").forEach(btn=>btn.addEventListener("click",()=> {
  const id=btn.dataset.copy;
  copyText(document.getElementById(id).value, btn.closest(".field").querySelector("label").textContent);
}));
document.getElementById("copyArticle").addEventListener("click",async()=>{
  const a=current();
  try{
    if(window.ClipboardItem){
      const rich="<h1>"+a.title.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")+"</h1>"+a.html;
      const item=new ClipboardItem({
        "text/html":new Blob([rich],{type:"text/html"}),
        "text/plain":new Blob([a.title+"\n\n"+a.plain],{type:"text/plain"})
      });
      await navigator.clipboard.write([item]);
    }else{
      await navigator.clipboard.writeText(a.title+"\n\n"+a.plain);
    }
    copyStatus.textContent="Full article copied";
  }catch{
    await navigator.clipboard.writeText(a.title+"\n\n"+a.plain);
    copyStatus.textContent="Article copied as text";
  }
});
picker.addEventListener("change",render);
render();
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

  return new Response(page(session), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
