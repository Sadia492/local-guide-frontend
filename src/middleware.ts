// // // src/proxy.ts
// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";

// // // Export the function as "proxy" (not "middleware")
// // export function proxy(request: NextRequest) {
// //   const { pathname } = request.nextUrl;
// //   const accessToken = request.cookies.get("accessToken")?.value;

// //   // Public routes
// //   const publicRoutes = [
// //     "/",
// //     "/explore",
// //     "/tours",
// //     "/login",
// //     "/register",
// //     "/api",
// //   ];
// //   const isPublicRoute = publicRoutes.some(
// //     (route) => pathname === route || pathname.startsWith(`${route}/`)
// //   );

// //   // If accessing protected route without token
// //   if (!isPublicRoute && !accessToken) {
// //     const loginUrl = new URL("/login", request.url);
// //     loginUrl.searchParams.set("redirect", pathname);
// //     return NextResponse.redirect(loginUrl);
// //   }

// //   // If logged in and trying to access auth pages, redirect to dashboard
// //   if (accessToken && (pathname === "/login" || pathname === "/register")) {
// //     return NextResponse.redirect(new URL("/dashboard", request.url));
// //   }

// //   return NextResponse.next();
// // }

// // // Config is now "match" instead of "matcher"
// // export const match = [
// //   "/dashboard/:path*",
// //   "/profile/:path*",
// //   "/bookings/:path*",
// //   "/login",
// //   "/register",
// // ];

// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Use "middleware" as the default export
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const accessToken = request.cookies.get("accessToken")?.value;

//   // Log for debugging
//   console.log(`Middleware: ${pathname}, Token: ${!!accessToken}`);

//   // Public routes that don't need protection
//   const publicRoutes = [
//     "/",
//     "/explore",
//     "/tours",
//     "/login",
//     "/register",
//     "/api",
//     "/_next",
//     "/favicon.ico",
//   ];

//   const isPublicRoute = publicRoutes.some(
//     (route) => pathname === route || pathname.startsWith(`${route}/`)
//   );

//   // If trying to access protected route without token
//   if (!isPublicRoute && !accessToken) {
//     console.log(`Blocking ${pathname} - no token found`);
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // If user has token and tries to access login/register
//   if (accessToken && (pathname === "/login" || pathname === "/register")) {
//     console.log(`Redirecting authenticated user from ${pathname} to dashboard`);
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// // Use "matcher" for configuration
// export const config = {
//   matcher: [
//     // Apply to all routes except static files
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//   ],
// };
