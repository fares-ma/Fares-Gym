import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("fares_hub_session")?.value;

  // Allow static files, public API routes, or Next.js internals
  // Use a strict extension regex instead of naive pathname.includes(".")
  // to prevent auth bypass via crafted paths like /api/data.secret
  const STATIC_FILE_RE = /\.(ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|map|woff2?|ttf|eot|json|webmanifest|xml|txt|robots\.txt)$/i;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    STATIC_FILE_RE.test(pathname) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/login";

  // If user is trying to access a protected route without a session cookie
  if (!sessionCookie && !isLoginPage) {
    // If it's an API route, return 401 JSON instead of HTML redirect
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // NOTE: Do NOT unconditionally redirect /login to / when sessionCookie exists.
  // If the session has expired or been revoked in the database, layout.tsx will redirect back to /login.
  // An unconditional redirect here would trigger an infinite redirect loop (ERR_TOO_MANY_REDIRECTS).
  // Allowing /login to render lets the user re-authenticate cleanly.

  return NextResponse.next();
}

export const config = {
  // Protect all application paths and API routes while excluding static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

