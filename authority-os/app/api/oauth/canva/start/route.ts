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
  const clientId = process.env.CANVA_CLIENT_ID?.trim();
  const base = process.env.AUTHORITY_OS_BASE_URL?.replace(/\/$/, "");

  if (!clientId || !base) {
    return NextResponse.json(
      { error: "CANVA_CLIENT_ID and AUTHORITY_OS_BASE_URL must be configured first." },
      { status: 503 }
    );
  }

  const state = randomBytes(32).toString("hex");
  const verifier = base64url(randomBytes(64));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  const redirectUri = base + "/api/oauth/canva/callback";

  const scopes = [
    "design:meta:read",
    "design:content:read",
    "design:content:write",
    "asset:read",
    "asset:write",
    "brandtemplate:meta:read",
    "brandtemplate:content:read",
    "folder:read",
    "folder:write",
    "profile:read"
  ];

  const url = new URL("https://www.canva.com/api/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "s256");

  const response = NextResponse.redirect(url);
  response.cookies.set("canva_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/canva",
    maxAge: 600
  });
  response.cookies.set("canva_oauth_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/api/oauth/canva",
    maxAge: 600
  });
  return response;
}
