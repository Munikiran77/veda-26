import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /client/* routes (exclude /client/login and /client/signup)
  if (
    pathname.startsWith("/client") &&
    !pathname.startsWith("/client/login") &&
    !pathname.startsWith("/client/signup")
  ) {
    // 1. Check authoritative production session cookie (sb_session)
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload && payload.role === "CLIENT") {
        return NextResponse.next();
      }
    }


    const loginUrl = new URL("/client/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*"],
};
