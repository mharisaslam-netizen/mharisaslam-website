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

  if (error) return html("Google connection declined", `<p>Google returned: <code>${error}</code></p>`);
  if (!code || !state) return html("Google connection failed", "<p>Missing authorization code or state.</p>");

  const cookie = request.headers.get("cookie") || "";
  const stateMatch = cookie.match(/(?:^|; )google_oauth_state=([^;]+)/);
  const expectedState = stateMatch ? decodeURIComponent(stateMatch[1]) : "";

  if (!expectedState || expectedState !== state) {
    return html("Google connection failed", "<p>Security state check failed. Restart the Google connection flow.</p>");
  }

  const clientId = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !clientSecret || !base) {
    return html("Google connection failed", "<p>Google OAuth client credentials are not configured in Vercel.</p>");
  }

  const redirectUri = base + "/api/oauth/google/callback";
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store"
  });

  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token?.refresh_token) {
    return html(
      "Google connection failed",
      `<p>Token exchange did not return a refresh token.</p>
       <p>Client ID used by Authority OS: <code>${clientId}</code></p>
       <p>Redirect URI used: <code>${redirectUri}</code></p>
       <pre><code>${JSON.stringify(token, null, 2).replace(/</g, "&lt;")}</code></pre>
       <p>Restart the flow and approve consent again. Authority OS requests offline access with prompt=consent specifically so Google returns a refresh token.</p>`
    );
  }

  const safeToken = String(token.refresh_token)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;");

  return html(
    "Google authorization complete",
    `<p>Authority OS now has offline Search Console read/write access for sitemap submission and index monitoring, plus GA4 read access.</p>
     <p>Copy this refresh token now and store it in Vercel as the Secret environment variable <code>GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN</code>. Do not paste it into ChatGPT.</p>
     <textarea readonly onclick="this.select()">${safeToken}</textarea>
     <p>Also set <code>GOOGLE_SEARCH_CONSOLE_SITE</code> to <code>sc-domain:mharisaslam.com</code> and <code>GA4_PROPERTY_ID</code> to <code>554707017</code>.</p>
     <p>After saving the variables, redeploy Authority OS once.</p>`
  );
}
