import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !base) {
    return NextResponse.json(
      { error: "GOOGLE_SEARCH_CONSOLE_CLIENT_ID and AUTHORITY_OS_BASE_URL must be configured first." },
      { status: 503 }
    );
  }

  const state = randomBytes(32).toString("hex");
  const redirectUri = base + "/api/oauth/google/callback";

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    [
      "https://www.googleapis.com/auth/webmasters",
      "https://www.googleapis.com/auth/analytics.readonly"
    ].join(" ")
  );
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/google",
    maxAge: 600
  });
  return response;
}
