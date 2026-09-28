import {
  GLOBAL_GROWTHS_SESSION_COOKIE,
  decryptSession,
  parseCookies
} from "../../../lib/global-growths-linkedin-session.js";

export function GET(request) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const session = secret ? decryptSession(cookies[GLOBAL_GROWTHS_SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());
  const organizationId = String(process.env.GLOBAL_GROWTHS_LINKEDIN_ORG_ID || "145192693");

  return Response.json(
    {
      connected,
      name: connected ? session.name : null,
      expiresAt: connected ? new Date(session.expiresAt).toISOString() : null,
      organizationId,
      organizationUrn: `urn:li:organization:${organizationId}`,
      configured: Boolean(
        process.env.LINKEDIN_CLIENT_ID &&
        process.env.LINKEDIN_CLIENT_SECRET &&
        process.env.LINKEDIN_REDIRECT_URI &&
        process.env.LINKEDIN_SESSION_SECRET
      )
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } }
  );
}
