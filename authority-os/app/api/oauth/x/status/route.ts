import { NextResponse } from "next/server";
import {
  decryptXTokenSession,
  X_REFRESH_COOKIE
} from "../../../../../lib/x-cookie";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(X_REFRESH_COOKIE + "="));

  const raw = cookie
    ? decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1))
    : "";
  const session = decryptXTokenSession(raw);

  const accessTokenReady = Boolean(
    session?.accessToken &&
      session?.expiresAt &&
      session.expiresAt > Date.now() + 30_000
  );

  return NextResponse.json(
    {
      connected: Boolean(session?.refreshToken),
      browserTokenReady: Boolean(session?.refreshToken),
      accessTokenReady,
      sessionVersion: Number(session?.version || 0),
      sessionMode: !session
        ? "NONE"
        : session.version >= 2
          ? "DURABLE"
          : "LEGACY_REFRESH_ONLY",
      serverFallbackConfigured: Boolean(
        process.env.X_REFRESH_TOKEN?.trim()
      )
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
