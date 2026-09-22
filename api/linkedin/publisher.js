import { linkedinDrafts } from "../../lib/linkedin-drafts.js";
import {
  SESSION_COOKIE,
  createApprovalToken,
  decryptSession,
  parseCookies
} from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function jsonForScript(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function page(session, csrfToken) {
  const draftsJson = jsonForScript(linkedinDrafts);
  const first = linkedinDrafts.find(x => x.id === "saudi-market-entry-economics") || linkedinDrafts[0];
  const expiry = new Date(session.expiresAt).toLocaleString("en-GB", { timeZone: "Asia/Qatar", dateStyle: "medium", timeStyle: "short" });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Haris Content Publisher</title>
<style>
:root{--navy:#0c2630;--ink:#173039;--teal:#0b857d;--line:#d7dfdc;--paper:#f4f0e7;--white:#fff;--muted:#63777d}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif}
main{width:min(1120px,calc(100% - 32px));margin:36px auto 64px}
.top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:24px}
.eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--teal)}
h1{margin:8px 0 8px;font-size:34px;line-height:1.1;color:var(--navy)}.sub{margin:0;color:var(--muted);line-height:1.55}
.status{background:#e4f2ef;border-left:4px solid var(--teal);padding:14px 16px;min-width:280px;font-size:13px;line-height:1.5}
.grid{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}
.card{background:var(--white);border:1px solid var(--line);padding:24px}
label{display:block;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;margin:0 0 8px;color:var(--navy)}
select,input[type=text],textarea{width:100%;border:1px solid #bfcac7;background:#fff;color:var(--ink);padding:12px;font:inherit}
textarea{min-height:420px;resize:vertical;line-height:1.55}
.field{margin-bottom:18px}.counter{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-top:6px}
.preview{white-space:pre-wrap;line-height:1.55;font-size:15px}.preview-card{border:1px solid var(--line);margin-top:16px;padding:16px;background:#fafafa}
.preview-card strong{display:block;color:var(--navy);margin-bottom:6px}.preview-card span{color:var(--muted);font-size:13px;line-height:1.45}
.approval{display:flex;gap:10px;align-items:flex-start;margin:20px 0 14px;padding:14px;background:#fff7dd;border:1px solid #ead69d;font-size:13px;line-height:1.45}
button{width:100%;border:0;background:var(--navy);color:white;padding:14px 18px;font-weight:800;font-size:15px;cursor:pointer}
button:disabled{opacity:.45;cursor:not-allowed}.note{font-size:12px;color:var(--muted);line-height:1.5;margin-top:12px}
.back{display:inline-block;margin-top:20px;color:var(--teal);font-weight:700;text-decoration:none}
@media(max-width:850px){.grid{grid-template-columns:1fr}.top{display:block}.status{margin-top:16px}.card{padding:18px}}
</style>
</head>
<body>
<main>
  <div class="top">
    <div><div class="eyebrow">Private daily-post workspace</div><h1>Haris Content Publisher</h1><p class="sub">Review today’s exact post, visual and source. Edit freely. Nothing publishes until you explicitly approve the final version.</p><p style="margin:10px 0 0"><a href="/api/linkedin/article-studio" style="color:var(--teal);font-weight:700;text-decoration:none">Open Article Studio →</a></p></div>
    <div class="status"><strong>LinkedIn connected</strong><br>${esc(session.name || "Muhammad Haris Aslam")}<br>Authorization expires ${esc(expiry)} Qatar time.</div>
  </div>
  <div class="grid">
    <form class="card" method="post" action="/api/linkedin/publish" id="publisherForm">
      <input type="hidden" name="csrf" value="${esc(csrfToken)}">
      <input type="hidden" name="visualUrl" id="visualUrl" value="${esc(first.visualUrl || "")}">
      <input type="hidden" name="visualAlt" id="visualAlt" value="${esc(first.visualAlt || "")}">
      <input type="hidden" name="visualTitle" id="visualTitle" value="${esc(first.visualTitle || "")}">
      <div class="field"><label for="draft">Suggested post</label><select id="draft"></select></div>
      <div class="field"><label for="text">Final LinkedIn copy</label><textarea id="text" name="text" maxlength="3000" required>${esc(first.text)}</textarea><div class="counter"><span>Edit freely before publishing.</span><span><b id="count">0</b>/3000</span></div></div>
      <div class="field"><label for="articleUrl">Insight / source URL</label><input type="text" id="articleUrl" name="articleUrl" value="${esc(first.url)}" required></div>
      <div class="field"><label for="articleTitle">Article title</label><input type="text" id="articleTitle" name="articleTitle" value="${esc(first.title)}" maxlength="200"></div>
      <div class="field"><label for="articleDescription">Article description</label><input type="text" id="articleDescription" name="articleDescription" value="${esc(first.description)}" maxlength="300"></div>
      <div class="field"><label for="visibility">Visibility</label><select name="visibility" id="visibility"><option value="PUBLIC" selected>Public</option><option value="CONNECTIONS">Connections only</option></select></div>
      <label class="approval"><input type="checkbox" id="approve" name="approve" value="yes"> <span>I approve publishing this exact post to my personal LinkedIn profile now.</span></label>
      <button id="publishButton" type="submit" disabled>Approve &amp; publish now</button>
      <p class="note">There is no automatic posting from this page. The button remains disabled until you approve the exact final copy above.</p>
    </form>
    <aside class="card">
      <label>Post visual</label>
      <img id="visualPreview" src="${esc(first.visualUrl || "")}" alt="${esc(first.visualAlt || "LinkedIn post visual")}" style="width:100%;height:auto;border:1px solid var(--line);margin:0 0 18px;display:${first.visualUrl ? "block" : "none"}">
      <label>LinkedIn preview</label>
      <div class="preview" id="preview"></div>
      <div class="preview-card"><strong id="previewTitle"></strong><span id="previewDescription"></span><br><span id="previewUrl"></span></div>
    </aside>
  </div>
  <a class="back" href="/">Return to mharisaslam.com</a>
</main>
<script>
const drafts=${draftsJson};
const select=document.getElementById("draft");
const text=document.getElementById("text");
const url=document.getElementById("articleUrl");
const title=document.getElementById("articleTitle");
const description=document.getElementById("articleDescription");
const visibility=document.getElementById("visibility");
const visualUrl=document.getElementById("visualUrl");
const visualAlt=document.getElementById("visualAlt");
const visualTitle=document.getElementById("visualTitle");
const visualPreview=document.getElementById("visualPreview");
const count=document.getElementById("count");
const preview=document.getElementById("preview");
const previewTitle=document.getElementById("previewTitle");
const previewDescription=document.getElementById("previewDescription");
const previewUrl=document.getElementById("previewUrl");
const approve=document.getElementById("approve");
const button=document.getElementById("publishButton");
for(const draft of drafts){const option=document.createElement("option");option.value=draft.id;option.textContent=draft.label;select.appendChild(option)}
select.value="saudi-market-entry-economics";
function render(){count.textContent=text.value.length;preview.textContent=text.value;previewTitle.textContent=title.value;previewDescription.textContent=description.value;previewUrl.textContent=url.value;visualPreview.src=visualUrl.value||"";visualPreview.alt=visualAlt.value||"LinkedIn post visual";visualPreview.style.display=visualUrl.value?"block":"none"}
select.addEventListener("change",()=>{const d=drafts.find(x=>x.id===select.value);if(!d)return;text.value=d.text;url.value=d.url;title.value=d.title;description.value=d.description;visualUrl.value=d.visualUrl||"";visualAlt.value=d.visualAlt||"";visualTitle.value=d.visualTitle||"";approve.checked=false;button.disabled=true;render()});
for(const el of [text,url,title,description,visibility]) el.addEventListener("input",()=>{approve.checked=false;button.disabled=true;render()});
approve.addEventListener("change",()=>button.disabled=!approve.checked);
document.getElementById("publisherForm").addEventListener("submit",()=>{button.disabled=true;button.textContent="Publishing..."});
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
    return new Response(null, { status: 302, headers: { Location: "/api/linkedin/connect", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } });
  }

  const csrfToken = createApprovalToken(session, secret);
  return new Response(page(session, csrfToken), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
