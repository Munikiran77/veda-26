import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect /client/* routes (exclude /client/login and /client/signup)
  if (
    pathname.startsWith("/client") &&
    !pathname.startsWith("/client/login") &&
    !pathname.startsWith("/client/signup")
  ) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload && payload.role === "CLIENT") {
        return NextResponse.next();
      }
    }

    const loginUrl = new URL("/client/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    return redirectRes;
  }

  // 2. Protect /student/* routes (exclude /student/login and /student/signup)
  if (
    pathname.startsWith("/student") &&
    !pathname.startsWith("/student/login") &&
    !pathname.startsWith("/student/signup")
  ) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload && payload.role === "STUDENT") {
        return NextResponse.next();
      }
    }

    const loginUrl = new URL("/student/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
    return redirectRes;
  }

  // 3. Already authenticated students visiting /student/login or /student/signup -> server-side redirect to destination
  if (pathname === "/student/login" || pathname === "/student/signup") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload && payload.role === "STUDENT") {
        const fromParam = request.nextUrl.searchParams.get("from");
        const destination =
          fromParam &&
          fromParam.startsWith("/student") &&
          !fromParam.startsWith("/student/login") &&
          !fromParam.startsWith("/student/signup")
            ? fromParam
            : "/student";
        const redirectRes = NextResponse.redirect(new URL(destination, request.url));
        redirectRes.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
        return redirectRes;
      }
    }
  }

  // 4. Already authenticated clients visiting /client/login or /client/signup -> server-side redirect to destination
  if (pathname === "/client/login" || pathname === "/client/signup") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload && payload.role === "CLIENT") {
        const fromParam = request.nextUrl.searchParams.get("from");
        const destination =
          fromParam &&
          fromParam.startsWith("/client") &&
          !fromParam.startsWith("/client/login") &&
          !fromParam.startsWith("/client/signup")
            ? fromParam
            : "/client/dashboard";
        const redirectRes = NextResponse.redirect(new URL(destination, request.url));
        redirectRes.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
        return redirectRes;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/student/:path*"],
};
