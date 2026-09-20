import { SESSION_COOKIE, decryptSession, parseCookies } from "../../lib/linkedin-session.js";

export function GET(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());

  return Response.json(
    {
      connected,
      name: connected ? session.name : null,
      expiresAt: connected ? new Date(session.expiresAt).toISOString() : null,
      configured: Boolean(
        process.env.LINKEDIN_CLIENT_ID &&
        process.env.LINKEDIN_CLIENT_SECRET &&
        process.env.LINKEDIN_REDIRECT_URI &&
        process.env.LINKEDIN_SESSION_SECRET
      )
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
