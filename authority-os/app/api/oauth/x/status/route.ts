import { NextResponse } from "next/server";
import {
  decryptXRefreshToken,
  X_REFRESH_COOKIE
} from "../../../../../lib/x-cookie";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(X_REFRESH_COOKIE + "="));
  const raw = cookie ? decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1)) : "";
  const refreshToken = decryptXRefreshToken(raw);

  return NextResponse.json(
    {
      connected: Boolean(refreshToken),
      browserTokenReady: Boolean(refreshToken),
      serverFallbackConfigured: Boolean(process.env.X_REFRESH_TOKEN?.trim())
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
