import {
  STATE_COOKIE,
  clearStateCookie,
  encryptSession,
  parseCookies,
  sessionCookie
} from "../../lib/linkedin-session.js";

function page(title, message, ok = true) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:Arial,sans-serif;background:#f5f2ea;color:#10242b;margin:0;padding:48px}main{max-width:720px;margin:auto;background:white;padding:36px;border:1px solid #d9dfdc}h1{margin-top:0}a{color:#087f78;font-weight:700}</style></head><body><main><h1>${title}</h1><p>${message}</p><p><a href="/">Return to mharisaslam.com</a></p></main></body></html>`;
}

export default async function handler(req, res) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const sessionSecret = process.env.LINKEDIN_SESSION_SECRET;

  if (!clientId || !clientSecret || !redirectUri || !sessionSecret) {
    return res.status(503).send(page("LinkedIn connection is not configured", "The secure server settings are not complete yet.", false));
  }

  const cookies = parseCookies(req.headers.cookie || "");
  const expectedState = cookies[STATE_COOKIE];
  const returnedState = req.query?.state;
  const code = req.query?.code;
  const oauthError = req.query?.error;

  res.setHeader("Cache-Control", "no-store");

  if (oauthError) {
    res.setHeader("Set-Cookie", clearStateCookie());
    return res.status(400).send(page("LinkedIn authorization was not completed", "LinkedIn returned an authorization error. No publishing connection was saved.", false));
  }

  if (!code || !expectedState || !returnedState || expectedState !== returnedState) {
    res.setHeader("Set-Cookie", clearStateCookie());
    return res.status(400).send(page("LinkedIn authorization could not be verified", "The OAuth state check failed. Please start the connection again.", false));
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

    if (!tokenResponse.ok) throw new Error("Token exchange failed");
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
      email: profile.email || null
    };
    const encrypted = encryptSession(payload, sessionSecret);

    res.setHeader("Set-Cookie", [
      clearStateCookie(),
      sessionCookie(encrypted, Math.min(expiresIn, 5184000))
    ]);

    return res.status(200).send(page("LinkedIn connected", `Haris Content Publisher is connected to ${payload.name || "your LinkedIn account"}. No post has been published. Publishing will still require your approval.`));
  } catch {
    res.setHeader("Set-Cookie", clearStateCookie());
    return res.status(502).send(page("LinkedIn connection failed", "The authorization response was received, but the secure token exchange could not be completed. No post was published.", false));
  }
}
