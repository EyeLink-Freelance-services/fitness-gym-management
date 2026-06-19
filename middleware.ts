import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { decideMiddlewareAuth } from "@/middleware/auth-authorization";
import { isDashboardPath } from "@/config/routes.config";
import { LOGIN_PATH } from "@/middleware/auth-authorization";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let token: JWT | null = null;
  try {
    token = await getToken({ req: request });
  } catch {
    if (isDashboardPath(pathname)) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const decision = decideMiddlewareAuth(pathname, token);

  if (decision.action === "redirect") {
    const redirectUrl = new URL(decision.destination, request.url);
    if (decision.withCallback) {
      redirectUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every request path EXCEPT:
     *   - _next/static  (static assets)
     *   - _next/image   (Next.js image optimisation)
     *   - favicon.ico
     *   - api/auth/**   (NextAuth endpoints must never be intercepted)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
