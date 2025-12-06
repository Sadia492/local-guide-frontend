// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[Proxy] Checking route: ${pathname}`);

  // Protect dashboard routes AND profile routes
  const protectedRoutes = ["/dashboard", "/profile"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    console.log(`[Proxy] Protected route detected: ${pathname}`);

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

    console.log(`[Proxy] Access token found, allowing access to ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
