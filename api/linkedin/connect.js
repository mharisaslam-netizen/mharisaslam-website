import { randomState, stateCookie } from "../../lib/linkedin-session.js";

export default function handler(req, res) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(503).json({ ok: false, error: "LinkedIn OAuth is not configured yet." });
  }

  const state = randomState();
  const scope = "openid profile email w_member_social";
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope
  });

  res.setHeader("Set-Cookie", stateCookie(state));
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
}
