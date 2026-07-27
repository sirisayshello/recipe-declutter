import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check for session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If token exists, user is authenticated
  const user = token ? token : null;

  const { pathname } = request.nextUrl;
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!user) {
    // If user is already on public route, do nothing
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // If user is on private route "/welcome", redirect to "/"
    if (pathname === "/welcome") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from public routes
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/signup/:path*",
    "/dashboard/:path*",
    "/welcome/:path*",
    "/",
  ],
};
