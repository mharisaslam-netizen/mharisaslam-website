import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

export const runtime = "nodejs";

function base64url(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function GET() {
  const clientId = process.env.X_CLIENT_ID?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !base) {
    return NextResponse.json(
      { error: "X_CLIENT_ID and AUTHORITY_OS_BASE_URL must be configured first." },
      { status: 503 }
    );
  }

  const state = randomBytes(32).toString("hex");
  const verifier = base64url(randomBytes(64));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  const redirectUri = base + "/api/oauth/x/callback";

  const scopes = [
    "tweet.read",
    "tweet.write",
    "users.read",
    "offline.access",
    "media.write"
  ];

  const url = new URL("https://x.com/i/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(url);
  response.cookies.set("x_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/x",
    maxAge: 600
  });
  response.cookies.set("x_oauth_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/x",
    maxAge: 600
  });
  return response;
}
