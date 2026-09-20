import { randomState, stateCookie } from "../../lib/linkedin-session.js";

export function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return Response.json(
      { ok: false, error: "LinkedIn OAuth is not configured yet." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const state = randomState();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "openid profile email w_member_social"
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
      "Set-Cookie": stateCookie(state),
      "Cache-Control": "no-store"
    }
  });
}
