import {
  GLOBAL_GROWTHS_SESSION_COOKIE,
  createApprovalToken,
  decryptSession,
  parseCookies
} from "../../../lib/global-growths-linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function page(session, csrfToken) {
  const expiry = new Date(session.expiresAt).toLocaleString("en-GB", {
    timeZone: "Asia/Qatar",
    dateStyle: "medium",
    timeStyle: "short"
  });
  const orgId = String(process.env.GLOBAL_GROWTHS_LINKEDIN_ORG_ID || "145192693");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Global Growths LinkedIn Publisher</title>
<style>
:root{--navy:#071f49;--blue:#0d5cff;--ink:#10233f;--line:#d9e2ef;--paper:#f5f8fc;--white:#fff;--muted:#60728a;--ok:#e8f5ee}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,Arial,Helvetica,sans-serif}
main{width:min(1180px,calc(100% - 32px));margin:32px auto 64px}.top{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:24px}
.brand{display:flex;align-items:center;gap:14px}.mark{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--navy) 0 52%,var(--blue) 52% 100%)}
.eyebrow{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--blue)}h1{margin:6px 0 8px;font-size:34px;color:var(--navy)}.sub{margin:0;color:var(--muted);line-height:1.55}
.status{background:var(--ok);border-left:4px solid #25835e;padding:14px 16px;min-width:300px;font-size:13px;line-height:1.5}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px;align-items:start}.card{background:#fff;border:1px solid var(--line);padding:24px;border-radius:14px}
label{display:block;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px;color:var(--navy)}
input[type=text],textarea{width:100%;border:1px solid #bcc9d9;background:#fff;color:var(--ink);padding:12px 13px;font:inherit;border-radius:8px}
textarea{min-height:360px;resize:vertical;line-height:1.55}.field{margin-bottom:18px}.counter{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-top:6px}
.preview{white-space:pre-wrap;line-height:1.55;font-size:15px}.preview-card{border:1px solid var(--line);margin-top:16px;padding:16px;background:#fafcff;border-radius:10px}
.preview-card strong{display:block;color:var(--navy);margin-bottom:6px}.preview-card span{color:var(--muted);font-size:13px}
.approval{display:flex;gap:10px;align-items:flex-start;margin:20px 0 14px;padding:14px;background:#fff6db;border:1px solid #eed99b;font-size:13px;line-height:1.45;border-radius:10px}
button{width:100%;border:0;background:linear-gradient(90deg,var(--navy),var(--blue));color:white;padding:14px 18px;font-weight:800;font-size:15px;cursor:pointer;border-radius:9px}
button:disabled{opacity:.45;cursor:not-allowed}.note,.meta{font-size:12px;color:var(--muted);line-height:1.5}.links{display:flex;gap:16px;flex-wrap:wrap;margin-top:18px}.links a{color:var(--blue);font-weight:700;text-decoration:none}
@media(max-width:860px){.grid{grid-template-columns:1fr}.top{display:block}.status{margin-top:16px}}
</style></head><body><main>
<div class="top"><div><div class="brand"><div class="mark"></div><div><div class="eyebrow">Private publishing workspace</div><h1>Global Growths LinkedIn Publisher</h1></div></div>
<p class="sub">Create the final company-page post, optional source link and visual. Nothing publishes until you explicitly approve the exact version.</p>
<div class="links"><a href="/api/linkedin/global-growths/connect">Reconnect LinkedIn</a><a href="/api/linkedin/global-growths/status" target="_blank">Connection status</a></div></div>
<div class="status"><strong>LinkedIn connected</strong><br>${esc(session.name || "Authorized LinkedIn admin")}<br>Company Page ID: ${esc(orgId)}<br>Authorization expires ${esc(expiry)} Qatar time.</div></div>

<div class="grid"><form class="card" method="post" action="/api/linkedin/global-growths/publish" id="publisherForm">
<input type="hidden" name="csrf" value="${esc(csrfToken)}">
<div class="field"><label for="text">Final LinkedIn company-page copy</label><textarea id="text" name="text" maxlength="3000" required placeholder="Write the final Global Growths post here..."></textarea><div class="counter"><span>Edit freely before publishing.</span><span><b id="count">0</b>/3000</span></div></div>
<div class="field"><label for="sourceUrl">Optional source / article URL</label><input type="text" id="sourceUrl" name="sourceUrl" placeholder="https://globalgrowths.com/... or https://omangrowth.com/..."></div>
<div class="field"><label for="articleTitle">Optional source title</label><input type="text" id="articleTitle" name="articleTitle" maxlength="200"></div>
<div class="field"><label for="articleDescription">Optional source description</label><input type="text" id="articleDescription" name="articleDescription" maxlength="300"></div>
<div class="field"><label for="visualUrl">Optional visual URL</label><input type="text" id="visualUrl" name="visualUrl" placeholder="https://...png or ...jpg"><div class="meta">Approved domains: Global Growths, Oman Growth, mharisaslam.com and Authority OS.</div></div>
<div class="field"><label for="visualAlt">Visual alt text</label><input type="text" id="visualAlt" name="visualAlt" maxlength="300"></div>
<label class="approval"><input type="checkbox" id="approve" name="approve" value="yes"><span>I approve publishing this exact content to the <strong>Global Growths LinkedIn Company Page</strong> now.</span></label>
<button id="publishButton" type="submit" disabled>Approve &amp; publish to Global Growths</button><p class="note">No background auto-posting is enabled here.</p></form>
<aside class="card"><strong style="color:var(--navy)">Company Page Preview</strong><div class="field" style="margin-top:18px"><img id="visualPreview" alt="" style="width:100%;height:auto;border:1px solid var(--line);border-radius:10px;margin:0 0 18px;display:none"><div class="preview" id="preview">Your post preview will appear here.</div><div class="preview-card" id="sourceCard" style="display:none"><strong id="previewTitle"></strong><span id="previewDescription"></span><br><span id="previewUrl"></span></div></div></aside></div>
</main>
<script>
const text=document.getElementById("text"),sourceUrl=document.getElementById("sourceUrl"),title=document.getElementById("articleTitle"),description=document.getElementById("articleDescription"),visualUrl=document.getElementById("visualUrl"),visualAlt=document.getElementById("visualAlt"),count=document.getElementById("count"),preview=document.getElementById("preview"),sourceCard=document.getElementById("sourceCard"),previewTitle=document.getElementById("previewTitle"),previewDescription=document.getElementById("previewDescription"),previewUrl=document.getElementById("previewUrl"),visualPreview=document.getElementById("visualPreview"),approve=document.getElementById("approve"),button=document.getElementById("publishButton");
function render(){count.textContent=text.value.length;preview.textContent=text.value||"Your post preview will appear here.";previewTitle.textContent=title.value||"Source";previewDescription.textContent=description.value;previewUrl.textContent=sourceUrl.value;sourceCard.style.display=sourceUrl.value?"block":"none";if(visualUrl.value){visualPreview.src=visualUrl.value;visualPreview.alt=visualAlt.value||"Global Growths post visual";visualPreview.style.display="block"}else{visualPreview.removeAttribute("src");visualPreview.style.display="none"}}
for(const el of [text,sourceUrl,title,description,visualUrl,visualAlt])el.addEventListener("input",()=>{approve.checked=false;button.disabled=true;render()});approve.addEventListener("change",()=>button.disabled=!approve.checked);document.getElementById("publisherForm").addEventListener("submit",()=>{button.disabled=true;button.textContent="Publishing..."});render();
</script></body></html>`;
}

export function GET(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[GLOBAL_GROWTHS_SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());
  if (!connected) {
    return new Response(null, { status: 302, headers: { Location: "/api/linkedin/global-growths/connect", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } });
  }
  const csrfToken = createApprovalToken(session, secret);
  return new Response(page(session, csrfToken), { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } });
}
