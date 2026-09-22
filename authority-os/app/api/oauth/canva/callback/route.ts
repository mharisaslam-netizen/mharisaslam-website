export const runtime = "nodejs";

function html(title: string, body: string) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{background:#081019;color:#f2f5f7;font-family:system-ui;padding:40px;max-width:900px;margin:auto}code,textarea{width:100%;box-sizing:border-box;background:#0f1822;color:#f2f5f7;border:1px solid #263645;border-radius:10px;padding:12px}textarea{min-height:120px}a{color:#d5b36a}.box{border:1px solid #263645;border-radius:16px;padding:20px;background:#0f1822}</style></head><body><h1>${title}</h1><div class="box">${body}</div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

function cookieValue(cookie: string, name: string) {
  const match = cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return html("Canva connection declined", `<p>Canva returned: <code>${error}</code></p>`);
  if (!code || !state) return html("Canva connection failed", "<p>Missing authorization code or state.</p>");

  const cookie = request.headers.get("cookie") || "";
  const expectedState = cookieValue(cookie, "canva_oauth_state");
  const verifier = cookieValue(cookie, "canva_oauth_verifier");

  if (!expectedState || expectedState !== state || !verifier) {
    return html("Canva connection failed", "<p>Security state or PKCE verifier check failed. Restart the Canva connection flow.</p>");
  }

  const clientId = process.env.CANVA_CLIENT_ID?.trim();
  const clientSecret = process.env.CANVA_CLIENT_SECRET?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !clientSecret || !base) {
    return html("Canva connection failed", "<p>Canva OAuth client credentials are not configured in Vercel.</p>");
  }

  const redirectUri = base + "/api/oauth/canva/callback";
  const basic = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const form = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri
  });

  const tokenResponse = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form,
    cache: "no-store"
  });

  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token?.refresh_token) {
    return html(
      "Canva connection failed",
      `<p>Token exchange did not return a refresh token.</p>
       <p>Client ID used by Authority OS: <code>${clientId}</code></p>
       <p>Redirect URI used: <code>${redirectUri}</code></p>
       <pre><code>${JSON.stringify(token, null, 2).replace(/</g, "&lt;")}</code></pre>`
    );
  }

  const safeToken = String(token.refresh_token)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;");

  return html(
    "Canva authorization complete",
    `<p>Authority OS now has Canva Connect API authorization.</p>
     <p>Copy this refresh token now and store it in Vercel as the Secret environment variable <code>CANVA_REFRESH_TOKEN</code>. Do not paste it into ChatGPT.</p>
     <textarea readonly onclick="this.select()">${safeToken}</textarea>
     <p>After saving the variable, redeploy Authority OS once.</p>
     <p>Authority OS will use Canva for reviewable social artwork, carousel and template generation. Nothing will be posted to social channels by this connection alone.</p>`
  );
}
