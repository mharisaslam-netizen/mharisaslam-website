import { NextResponse } from "next/server";
import {
  encryptXRefreshToken,
  X_REFRESH_COOKIE
} from "../../../../lib/x-cookie";

export const runtime = "nodejs";

export async function POST() {
  const token = process.env.X_REFRESH_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      { error: "X_REFRESH_TOKEN is not configured." },
      { status: 503 }
    );
  }

  const response = NextResponse.json({
    connected: true,
    source: "server-fallback"
  });
  response.cookies.set(X_REFRESH_COOKIE, encryptXRefreshToken(token), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180
  });
  return response;
}
