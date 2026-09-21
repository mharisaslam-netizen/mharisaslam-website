import { NextResponse } from "next/server";

export const runtime = "nodejs";

function html(title: string, body: string) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{background:#081019;color:#f2f5f7;font-family:system-ui;padding:40px;max-width:900px;margin:auto}code,textarea{width:100%;box-sizing:border-box;background:#0f1822;color:#f2f5f7;border:1px solid #263645;border-radius:10px;padding:12px}textarea{min-height:120px}a{color:#d5b36a}.box{border:1px solid #263645;border-radius:16px;padding:20px;background:#0f1822}</style></head><body><h1>${title}</h1><div class="box">${body}</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return html("WordPress connection declined", `<p>WordPress returned: <code>${error}</code></p>`);
  if (!code || !state) return html("WordPress connection failed", "<p>Missing authorization code or state.</p>");

  const cookie = request.headers.get("cookie") || "";
  const stateMatch = cookie.match(/(?:^|; )wp_oauth_state=([^;]+)/);
  const expectedState = stateMatch ? decodeURIComponent(stateMatch[1]) : "";

  if (!expectedState || expectedState !== state) {
    return html("WordPress connection failed", "<p>Security state check failed. Restart the WordPress connection flow.</p>");
  }

  const clientId = process.env.WORDPRESS_CLIENT_ID;
  const clientSecret = process.env.WORDPRESS_CLIENT_SECRET;
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !clientSecret || !base) {
    return html("WordPress connection failed", "<p>WordPress client credentials are not configured in Vercel.</p>");
  }

  const redirectUri = base + "/api/oauth/wordpress/callback";
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  const tokenResponse = await fetch("https://public-api.wordpress.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store"
  });

  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token?.access_token) {
    return html(
      "WordPress connection failed",
      `<p>Token exchange failed.</p><pre><code>${JSON.stringify(token, null, 2).replace(/</g, "&lt;")}</code></pre>`
    );
  }

  const site = token.blog_url || process.env.WORDPRESS_SITE || "harisgccgrowth.wordpress.com";
  const safeToken = String(token.access_token).replace(/&/g, "&amp;").replace(/</g, "&lt;");

  return html(
    "WordPress authorization complete",
    `<p>Authority OS has received a WordPress.com access token for <strong>${site}</strong>.</p>
     <p>Copy this token now and store it in Vercel as the Secret environment variable <code>WORDPRESS_ACCESS_TOKEN</code>. Do not paste it into ChatGPT.</p>
     <textarea readonly onclick="this.select()">${safeToken}</textarea>
     <p>Also set <code>WORDPRESS_SITE</code> to <code>harisgccgrowth.wordpress.com</code>. After saving both variables, redeploy Authority OS once.</p>
     <p>This page is deliberately not cached.</p>`
  );
}
