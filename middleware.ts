import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import type { AccessTokenClaims } from "@/types/auth/token";
import { getDashboardFromClaims } from "@/config/role.config";

const LOGIN_PATH = "/auth/sign-in";

/** Public auth paths - redirect authenticated users away from these. */
const AUTH_PAGE_PREFIXES = [
  "/auth/sign-in",
  "/auth/forgot-password",
  "/auth/reset-password",
];

function getClaims(token: JWT | null): AccessTokenClaims | null {
  return ((token as (JWT & { claims?: AccessTokenClaims }) | null)?.claims ??
    null) as AccessTokenClaims | null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let token: JWT | null = null;
  try {
    token = await getToken({ req: request });
  } catch {
    return NextResponse.next();
  }

  const isAuthenticated =
    !!token?.accessToken && token?.error !== "RefreshAccessTokenError";

  const claims = isAuthenticated ? getClaims(token) : null;

  if (process.env.NODE_ENV === "development") {
    // To Remove 
    // eslint-disable-next-line no-console
    console.log("[middleware-auth]", {
      path: pathname,
      hasToken: !!token,
      hasAccessToken: !!token?.accessToken,
      hasClaims: !!claims,
      error: (token as any)?.error,
      contextType: claims?.contextType,
      roles: claims?.roles,
      permissions: claims?.permissions,
    });
  }

  const primaryDashboard = getDashboardFromClaims(claims);

  const isAuthPage = AUTH_PAGE_PREFIXES.some((p) => pathname.startsWith(p));
  const isDashboardRoute = pathname.startsWith("/dashboard/");

  // ── 1. Bounce authenticated users away from auth pages ─────────────────────
  if (isAuthPage && isAuthenticated && primaryDashboard) {
    if (pathname !== primaryDashboard) {
      return NextResponse.redirect(new URL(primaryDashboard, request.url));
    }
  }

  // ── 2. Protect all /dashboard/** routes ────────────────────────────────────
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Enforce RBAC strictly user is only allowed to access the dashboard that matches their primary context.
    if (primaryDashboard && !pathname.startsWith(primaryDashboard)) {
      return NextResponse.redirect(new URL(primaryDashboard, request.url));
    }
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
