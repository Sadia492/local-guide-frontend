// src/middleware.ts (or proxy.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only do basic protection, let DashboardLayout handle the rest
  const { pathname } = request.nextUrl;

  // List of public routes
  const publicRoutes = [
    "/",
    "/explore",
    "/tours",
    "/login",
    "/register",
    "/api",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's a dashboard route, let it through - DashboardLayout will handle auth
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    return NextResponse.next();
  }

  // For all other non-public routes, redirect to login if no token
  if (!isPublicRoute) {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Don't match dashboard routes
    "/((?!dashboard|profile).*)",
  ],
};
