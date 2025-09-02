import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isMaintenanceModeEnabled } from "@/lib/maintenance";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip static files and API routes
  if (pathname.startsWith("/api") || 
      pathname.startsWith("/_next") || 
      pathname.includes(".") ||
      pathname === "/favicon.ico") {
    return NextResponse.next();
  }
  
  // Check maintenance mode for non-admin routes
  if (!pathname.startsWith("/admin") && 
      pathname !== "/maintenance" && 
      pathname !== "/sign-in" &&
      pathname !== "/sign-up") {
    const maintenanceEnabled = await isMaintenanceModeEnabled();
    if (maintenanceEnabled) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }
  
  // Skip auth check for public pages
  if (pathname === "/maintenance" || 
      pathname === "/sign-in" || 
      pathname === "/sign-up" ||
      pathname === "/") {
    return NextResponse.next();
  }
  
  // Auth check for protected routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/", "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"]
};
