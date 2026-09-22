import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.WORDPRESS_CLIENT_ID?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");
  const site = process.env.WORDPRESS_SITE || "harisgccgrowth.wordpress.com";

  if (!clientId || !base) {
    return NextResponse.json(
      { error: "WORDPRESS_CLIENT_ID and AUTHORITY_OS_BASE_URL must be configured first." },
      { status: 503 }
    );
  }

  const state = randomBytes(32).toString("hex");
  const redirectUri = base + "/api/oauth/wordpress/callback";

  const url = new URL("https://public-api.wordpress.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("blog", site);
  url.searchParams.set("scope", "global");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("wp_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/wordpress",
    maxAge: 600
  });
  return response;
}
