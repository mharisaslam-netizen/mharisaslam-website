import {
  SESSION_COOKIE,
  decryptSession,
  parseCookies,
  verifyApprovalToken
} from "../../lib/linkedin-session.js";

const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function resultPage(title, message, postUrl = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${esc(title)}</title><style>body{font-family:Arial,sans-serif;background:#f4f0e7;color:#173039;margin:0;padding:48px}main{max-width:720px;margin:auto;background:#fff;border:1px solid #d7dfdc;padding:36px}h1{color:#0c2630;margin-top:0}a{color:#0b857d;font-weight:700}</style></head><body><main><h1>${esc(title)}</h1><p>${esc(message)}</p>${postUrl ? `<p><a href="${esc(postUrl)}" target="_blank" rel="noopener noreferrer">Open the LinkedIn post</a></p>` : ""}<p><a href="/api/linkedin/publisher">Return to publisher</a></p></main></body></html>`;
}

function allowedArticleUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.mharisaslam.com" && url.pathname.startsWith("/insights/");
  } catch {
    return false;
  }
}

export async function POST(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());

  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow, noarchive"
  };

  if (!connected) return new Response(resultPage("LinkedIn connection required", "Reconnect LinkedIn before publishing."), { status: 401, headers });

  const form = await request.formData();
  const csrf = String(form.get("csrf") || "");
  const approved = String(form.get("approve") || "") === "yes";
  const text = String(form.get("text") || "").trim();
  const articleUrl = String(form.get("articleUrl") || "").trim();
  const articleTitle = String(form.get("articleTitle") || "").trim().slice(0, 200);
  const articleDescription = String(form.get("articleDescription") || "").trim().slice(0, 300);
  const visibility = String(form.get("visibility") || "PUBLIC") === "CONNECTIONS" ? "CONNECTIONS" : "PUBLIC";

  if (!verifyApprovalToken(csrf, session, secret) || !approved) {
    return new Response(resultPage("Approval required", "The post was not published because explicit approval could not be verified."), { status: 403, headers });
  }
  if (!text || text.length > 3000) {
    return new Response(resultPage("Post not published", "LinkedIn post copy must be between 1 and 3000 characters."), { status: 400, headers });
  }
  if (!allowedArticleUrl(articleUrl)) {
    return new Response(resultPage("Post not published", "For safety, this publisher currently allows article links only from mharisaslam.com/insights/."), { status: 400, headers });
  }
  if (!session.memberSub) {
    return new Response(resultPage("Post not published", "The connected LinkedIn member identifier is missing. Reconnect LinkedIn and try again."), { status: 400, headers });
  }

  const body = {
    author: `urn:li:person:${session.memberSub}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [{
          status: "READY",
          originalUrl: articleUrl,
          ...(articleTitle ? { title: { text: articleTitle } } : {}),
          ...(articleDescription ? { description: { text: articleDescription } } : {})
        }]
      }
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": visibility
    }
  };

  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("LinkedIn publish error", response.status, detail.slice(0, 1200));
      return new Response(resultPage("LinkedIn did not publish the post", `LinkedIn returned status ${response.status}. No successful publication was recorded.`), { status: 502, headers });
    }

    const postId = response.headers.get("x-restli-id") || response.headers.get("x-linkedin-id") || "";
    const postUrl = postId ? `https://www.linkedin.com/feed/update/${postId}` : "";
    return new Response(resultPage("Published to LinkedIn", "The approved post has been published to your personal LinkedIn profile.", postUrl), { status: 201, headers });
  } catch (error) {
    console.error("LinkedIn publish exception", error);
    return new Response(resultPage("LinkedIn publish failed", "A network or API error occurred. No successful publication was recorded."), { status: 502, headers });
  }
}
