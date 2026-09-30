import {
  encryptXTokenSession,
  X_REFRESH_COOKIE
} from "../../../../../lib/x-cookie";

export const runtime = "nodejs";

function html(title: string, body: string) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{background:#081019;color:#f2f5f7;font-family:system-ui;padding:40px;max-width:900px;margin:auto}code{background:#0f1822;color:#f2f5f7;border:1px solid #263645;border-radius:10px;padding:4px 7px}.box{border:1px solid #263645;border-radius:16px;padding:20px;background:#0f1822}</style></head><body><h1>${title}</h1><div class="box">${body}</div></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    }
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

  if (error) {
    return html(
      "X connection declined",
      `<p>X returned: <code>${error}</code></p>`
    );
  }

  if (!code || !state) {
    return html(
      "X connection failed",
      "<p>Missing authorization code or state.</p>"
    );
  }

  const cookie = request.headers.get("cookie") || "";
  const expectedState = cookieValue(cookie, "x_oauth_state");
  const verifier = cookieValue(cookie, "x_oauth_verifier");
  const returnPath = cookieValue(cookie, "x_oauth_return") || "/";

  if (!expectedState || expectedState !== state || !verifier) {
    return html(
      "X connection failed",
      "<p>Security state or PKCE verifier check failed. Restart the X connection flow.</p>"
    );
  }

  const clientId = process.env.X_CLIENT_ID?.trim();
  const clientSecret = process.env.X_CLIENT_SECRET?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !clientSecret || !base) {
    return html(
      "X connection failed",
      "<p>X OAuth client credentials are not configured in Vercel.</p>"
    );
  }

  const redirectUri = base + "/api/oauth/x/callback";
  const basic = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const form = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: verifier
  });

  const tokenResponse = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + basic,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form,
    cache: "no-store"
  });

  const token = await tokenResponse.json().catch(() => ({}));
  if (
    !tokenResponse.ok ||
    !token?.access_token ||
    !token?.refresh_token
  ) {
    return html(
      "X connection failed",
      `<p>Token exchange did not return the durable access and refresh token pair Authority OS requires.</p>
       <p>Client ID used by Authority OS: <code>${clientId}</code></p>
       <p>Redirect URI used: <code>${redirectUri}</code></p>
       <pre><code>${JSON.stringify(token, null, 2).replace(/</g, "&lt;")}</code></pre>`
    );
  }

  const expiresIn = Number(token.expires_in || 0);
  const tokenSession = {
    version: 2,
    accessToken: String(token.access_token),
    refreshToken: String(token.refresh_token),
    expiresAt: expiresIn
      ? Date.now() + expiresIn * 1000
      : Date.now() + 60 * 60 * 1000,
    scope: String(token.scope || ""),
    obtainedAt: Date.now()
  };

  const safeReturn =
    returnPath.startsWith("/?session=wrun_")
      ? returnPath
      : "/";
  const destination = new URL(safeReturn, base);
  destination.searchParams.set("x_connected", "1");

  const response = Response.redirect(destination.toString(), 302);
  response.headers.append(
    "Set-Cookie",
    X_REFRESH_COOKIE +
      "=" +
      encryptXTokenSession(tokenSession) +
      "; Path=/; Max-Age=15552000; HttpOnly; Secure; SameSite=Lax"
  );
  response.headers.append(
    "Set-Cookie",
    "x_oauth_state=; Path=/api/oauth/x; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );
  response.headers.append(
    "Set-Cookie",
    "x_oauth_verifier=; Path=/api/oauth/x; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );
  response.headers.append(
    "Set-Cookie",
    "x_oauth_return=; Path=/api/oauth/x; Max-Age=0; HttpOnly; Secure; SameSite=Lax"
  );

  return response;
}
