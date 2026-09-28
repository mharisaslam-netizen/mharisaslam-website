import {
  STATE_COOKIE,
  clearStateCookie,
  encryptSession,
  parseCookies,
  sessionCookie
} from "../../lib/linkedin-session.js";
import { globalGrowthsSessionCookie } from "../../lib/global-growths-linkedin-session.js";

function page(title, message, href = "/", linkLabel = "Return to mharisaslam.com") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>${title}</title><style>body{font-family:Arial,sans-serif;background:#f5f2ea;color:#10242b;margin:0;padding:48px}main{max-width:720px;margin:auto;background:white;padding:36px;border:1px solid #d9dfdc}h1{margin-top:0}a{color:#087f78;font-weight:700}</style></head><body><main><h1>${title}</h1><p>${message}</p><p><a href="${href}">${linkLabel}</a></p></main></body></html>`;
}

function htmlResponse(title, message, status = 200, cookies = [], href = "/", linkLabel = "Return to mharisaslam.com") {
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(page(title, message, href, linkLabel), { status, headers });
}

export async function GET(request) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const sessionSecret = process.env.LINKEDIN_SESSION_SECRET;

  if (!clientId || !clientSecret || !redirectUri || !sessionSecret) {
    return htmlResponse("LinkedIn connection is not configured", "The secure server settings are not complete yet.", 503);
  }

  const url = new URL(request.url);
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const expectedState = cookies[STATE_COOKIE];
  const returnedState = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const globalGrowths = Boolean(returnedState && returnedState.startsWith("gg."));

  if (oauthError) {
    const detail = url.searchParams.get("error_description") || "LinkedIn returned an authorization error.";
    return htmlResponse(
      globalGrowths ? "Global Growths LinkedIn authorization was not completed" : "LinkedIn authorization was not completed",
      detail + " No publishing connection was saved.",
      400,
      [clearStateCookie()],
      globalGrowths ? "/api/linkedin/global-growths/publisher" : "/",
      globalGrowths ? "Return to Global Growths Publisher" : "Return to mharisaslam.com"
    );
  }

  if (!code || !expectedState || !returnedState || expectedState !== returnedState) {
    return htmlResponse("LinkedIn authorization could not be verified", "The OAuth state check failed. Please start the connection again.", 400, [clearStateCookie()]);
  }

  try {
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!tokenResponse.ok) {
      const detail = await tokenResponse.text().catch(() => "");
      throw new Error("Token exchange failed" + (detail ? ": " + detail.slice(0, 300) : ""));
    }
    const token = await tokenResponse.json();

    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    if (!profileResponse.ok) throw new Error("Profile verification failed");
    const profile = await profileResponse.json();

    const expiresIn = Number(token.expires_in || 5184000);
    const payload = {
      accessToken: token.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
      memberSub: profile.sub || null,
      name: profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(" ") || null,
      email: profile.email || null,
      publisher: globalGrowths ? "global-growths" : "personal"
    };

    const encrypted = encryptSession(payload, sessionSecret);

    if (globalGrowths) {
      return htmlResponse(
        "Global Growths LinkedIn connected",
        `Global Growths Publisher is connected through ${payload.name || "your LinkedIn account"}. No post has been published. Publishing still requires explicit approval.`,
        200,
        [clearStateCookie(), globalGrowthsSessionCookie(encrypted, Math.min(expiresIn, 5184000))],
        "/api/linkedin/global-growths/publisher",
        "Open Global Growths Publisher"
      );
    }

    return htmlResponse(
      "LinkedIn connected",
      `Haris Content Publisher is connected to ${payload.name || "your LinkedIn account"}. No post has been published. Publishing will still require your approval.`,
      200,
      [clearStateCookie(), sessionCookie(encrypted, Math.min(expiresIn, 5184000))]
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "The secure token exchange could not be completed.";
    return htmlResponse(
      globalGrowths ? "Global Growths LinkedIn connection failed" : "LinkedIn connection failed",
      detail + " No post was published.",
      502,
      [clearStateCookie()],
      globalGrowths ? "/api/linkedin/global-growths/connect" : "/api/linkedin/connect",
      "Try again"
    );
  }
}
