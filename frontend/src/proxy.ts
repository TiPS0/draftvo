import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt, signJwt, SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/register"];
const API_PREFIX = "/api";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes and Next.js internals
  if (
    pathname.startsWith(API_PREFIX) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value ?? null;
  const payload = token ? await verifyJwt(token) : null;
  const isAuthenticated = payload !== null;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isAuthenticated && !isPublicPath) {
    // Unauthenticated → redirect to login
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicPath) {
    // Already logged in → send to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();
  if (!isPublicPath) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  // Sliding Session: Refresh token if older than 12 hours
  if (isAuthenticated && payload) {
    const now = Math.floor(Date.now() / 1000);
    const age = now - payload.iat;
    const TWELVE_HOURS = 60 * 60 * 12;

    if (age > TWELVE_HOURS) {
      const newToken = await signJwt({
        sub: payload.sub,
        name: payload.name,
        role: payload.role,
      });
      response.cookies.set(SESSION_COOKIE, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
