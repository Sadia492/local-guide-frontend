// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Proxy] Checking route: ${pathname}`);

  // Protect ALL dashboard routes
  if (pathname.startsWith("/dashboard")) {
    console.log(`[Proxy] Dashboard route detected: ${pathname}`);

    // Get auth token from cookies
    const accessToken = request.cookies.get("accessToken")?.value;

    console.log(`[Proxy] Access token exists: ${!!accessToken}`);

    // If no token, redirect to login
    if (!accessToken) {
      console.log(`[Proxy] No access token, redirecting to login`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[Proxy] Access token found, allowing dashboard access`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
