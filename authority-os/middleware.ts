import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Haris Authority OS"' }
  });
}

export function middleware(request: NextRequest) {
  const user = process.env.AUTHORITY_OS_USER;
  const password = process.env.AUTHORITY_OS_PASSWORD;

  if (!user || !password) return unauthorized();

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    const suppliedUser = decoded.slice(0, separator);
    const suppliedPassword = decoded.slice(separator + 1);

    if (suppliedUser !== user || suppliedPassword !== password) return unauthorized();
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/((?!api/mcp|_next/static|_next/image|favicon.ico).*)"]
};
