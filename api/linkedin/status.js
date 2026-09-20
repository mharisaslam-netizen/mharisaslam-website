// LinkedIn publisher connection status
import { SESSION_COOKIE, decryptSession, parseCookies } from "../../lib/linkedin-session.js";

export default function handler(req, res) {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  const cookies = parseCookies(req.headers.cookie || "");
  const session = secret ? decryptSession(cookies[SESSION_COOKIE], secret) : null;
  const connected = Boolean(session?.accessToken && session?.expiresAt > Date.now());

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    connected,
    name: connected ? session.name : null,
    expiresAt: connected ? new Date(session.expiresAt).toISOString() : null
  });
}
