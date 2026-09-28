import {
  GLOBAL_GROWTHS_SESSION_COOKIE,
  decryptSession,
  parseCookies,
  verifyApprovalToken
} from "../../../lib/global-growths-linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function resultPage(title, message, postUrl = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${esc(title)}</title><style>body{font-family:Arial,sans-serif;background:#f5f8fc;color:#10233f;margin:0;padding:48px}main{max-width:760px;margin:auto;background:#fff;border:1px solid #d9e2ef;border-radius:14px;padding:36px}h1{color:#071f49;margin-top:0}a{color:#0d5cff;font-weight:700}</style></head><body><main><h1>${esc(title)}</h1><p>${esc(message)}</p>${postUrl ? `<p><a href="${esc(postUrl)}" target="_blank" rel="noopener noreferrer">Open the LinkedIn post</a></p>` : ""}<p><a href="/api/linkedin/global-growths/publisher">Return to Global Growths Publisher</a></p></main></body></html>`;
}

function allowedSourceUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "globalgrowths.com","www.globalgrowths.com",
      "omangrowth.com","www.omangrowth.com",
      "mharisaslam.com","www.mharisaslam.com"
    ]);
    return url.protocol === "https:" && allowedHosts.has(url.hostname);
  } catch {
    return false;
  }
}

function allowedVisualUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "globalgrowths.com","www.globalgrowths.com",
      "omangrowth.com","www.omangrowth.com",
      "mharisaslam.com","www.mharisaslam.com"
    ]);
    const approvedAsset = url.protocol === "https:" && allowedHosts.has(url.hostname) && /\.(png|jpe?g)$/i.test(url.pathname);
    const authorityPreview = url.protocol === "https:" && url.hostname === "haris-authority-os.vercel.app" && url.pathname === "/api/preview/asset";
    return approvedAsset || authorityPreview;
  } catch {
    return false;
  }
}

async function uploadImage(session, visualUrl, ownerUrn) {
  const register = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Linkedin-Version": "202609",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ initializeUploadRequest: { owner: ownerUrn } })
  });

  const registerDetail = await register.text();
  if (!register.ok) throw new Error("LinkedIn image initialization failed (" + register.status + "): " + registerDetail.slice(0, 500));

  let data = {};
  try { data = JSON.parse(registerDetail); } catch {}
  const uploadUrl = data?.value?.uploadUrl;
  const imageUrn = data?.value?.image;
  if (!uploadUrl || !imageUrn) throw new Error("LinkedIn did not return current Images API upload details.");

  const image = await fetch(visualUrl, { headers: { "User-Agent": "GlobalGrowths-Publisher/1.0" } });
  if (!image.ok) throw new Error(`Visual fetch failed (${image.status})`);
  const type = String(image.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!["image/png","image/jpeg"].includes(type)) throw new Error(`Unsupported visual type: ${type || "unknown"}`);
  const bytes = await image.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > 10 * 1024 * 1024) throw new Error("Visual is empty or too large.");

  const uploaded = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": type },
    body: bytes
  });
  if (!uploaded.ok) {
    const detail = await uploaded.text().catch(() => "");
    throw new Error("LinkedIn image upload failed (" + uploaded.status + "): " + detail.slice(0, 500));
  }
  return imageUrn;
}

async function createPost(session, body) {
  return fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "X-Restli-Protocol-Version": "2.0.0",
      "Linkedin-Version": "202609",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export async function POST(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[GLOBAL_GROWTHS_SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());
  const headers = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

  if (!connected) return new Response(resultPage("LinkedIn connection required", "Reconnect LinkedIn before publishing to Global Growths."), { status: 401, headers });

  const form = await request.formData();
  const csrf = String(form.get("csrf") || "");
  const approved = String(form.get("approve") || "") === "yes";
  const text = String(form.get("text") || "").trim();
  const sourceUrl = String(form.get("sourceUrl") || "").trim();
  const articleTitle = String(form.get("articleTitle") || "").trim().slice(0, 200);
  const articleDescription = String(form.get("articleDescription") || "").trim().slice(0, 300);
  const visualUrl = String(form.get("visualUrl") || "").trim();
  const visualAlt = String(form.get("visualAlt") || "").trim().slice(0, 300);

  if (!verifyApprovalToken(csrf, session, secret) || !approved) {
    return new Response(resultPage("Approval required", "The post was not published because explicit approval could not be verified."), { status: 403, headers });
  }
  if (!text || text.length > 3000) {
    return new Response(resultPage("Post not published", "LinkedIn post copy must be between 1 and 3000 characters."), { status: 400, headers });
  }
  if (!allowedSourceUrl(sourceUrl)) {
    return new Response(resultPage("Post not published", "The optional source URL must be on globalgrowths.com, omangrowth.com or mharisaslam.com."), { status: 400, headers });
  }
  if (!allowedVisualUrl(visualUrl)) {
    return new Response(resultPage("Post not published", "The visual URL is not from an approved Global Growths publishing source."), { status: 400, headers });
  }

  const orgId = String(process.env.GLOBAL_GROWTHS_LINKEDIN_ORG_ID || "145192693").trim();
  if (!/^\d+$/.test(orgId)) {
    return new Response(resultPage("Publisher configuration error", "The Global Growths LinkedIn organization ID is invalid."), { status: 503, headers });
  }

  try {
    const author = `urn:li:organization:${orgId}`;
    const finalText = sourceUrl && !text.includes(sourceUrl) ? text + "\n\n" + sourceUrl : text;
    if (finalText.length > 3000) {
      return new Response(resultPage("Post not published", "The approved copy plus the source URL exceeds LinkedIn's 3000-character limit."), { status: 400, headers });
    }

    let imageUrn = "";
    if (visualUrl) imageUrn = await uploadImage(session, visualUrl, author);

    const baseBody = {
      author,
      commentary: finalText,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    };

    const diagnostics = [];
    let response;

    if (sourceUrl) {
      const article = {
        source: sourceUrl,
        ...(imageUrn ? { thumbnail: imageUrn } : {}),
        ...(articleTitle ? { title: articleTitle } : {}),
        ...(articleDescription ? { description: articleDescription } : {})
      };
      response = await createPost(session, { ...baseBody, content: { article } });
      if (!response.ok) {
        const detail = await response.text();
        diagnostics.push("Article post: HTTP " + response.status + " " + detail.slice(0, 500));
      }
    }

    if (!response || !response.ok) {
      const fallbackBody = imageUrn
        ? { ...baseBody, content: { media: { id: imageUrn, ...(articleTitle ? { title: articleTitle } : {}), ...(visualAlt ? { altText: visualAlt } : {}) } } }
        : baseBody;
      response = await createPost(session, fallbackBody);
      if (!response.ok) {
        const detail = await response.text();
        diagnostics.push((imageUrn ? "Image fallback" : "Text post") + ": HTTP " + response.status + " " + detail.slice(0, 500));
      }
    }

    if (!response.ok) {
      console.error("Global Growths LinkedIn publish diagnostics", diagnostics.join(" | "));
      return new Response(resultPage("LinkedIn publish failed", diagnostics.join(" | ") + " No successful publication was recorded."), { status: 502, headers });
    }

    const postId = response.headers.get("x-restli-id") || response.headers.get("x-linkedin-id") || "";
    const postUrl = postId ? `https://www.linkedin.com/feed/update/${postId}` : "";
    return new Response(resultPage("Published to Global Growths", "The approved post has been published to the Global Growths LinkedIn Company Page.", postUrl), { status: 201, headers });
  } catch (error) {
    console.error("Global Growths LinkedIn publish exception", error);
    const detail = error instanceof Error ? error.message : "Unknown LinkedIn publishing error.";
    return new Response(resultPage("LinkedIn publish failed", detail + " No successful publication was recorded."), { status: 502, headers });
  }
}
