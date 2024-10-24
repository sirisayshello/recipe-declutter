import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// getServerSession can not be used in middleware. Checking for user token instead.

export async function middleware(request: NextRequest) {
  // Check for session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login page if there's no token i.e. user is not authenticated
  if (!token) {
    // If user already on /login or /signup, do nothing
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup"
    ) {
      return NextResponse.next();
    }
    // Otherwise, redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from /login and /signup
  if (token) {
    const { pathname } = request.nextUrl;
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage
    }
    return NextResponse.next(); // Allow access to other routes
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/signup/:path*", "/dashboard/:path*"],
};
