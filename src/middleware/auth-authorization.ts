import type { JWT } from "next-auth/jwt";
import type { AccessTokenClaims } from "@/types/auth/token";
import {
  getDefaultRouteFromClaims,
  isAuthPagePath,
  isDashboardPath,
  isPathAllowedForRole,
  getRoleFromClaims,
} from "@/config/routes.config";

export const LOGIN_PATH = "/auth/sign-in";

export type MiddlewareAuthDecision =
  | { action: "allow" }
  | { action: "redirect"; destination: string; withCallback?: boolean };

function getClaims(token: JWT | null): AccessTokenClaims | null {
  return ((token as (JWT & { claims?: AccessTokenClaims }) | null)?.claims ??
    null) as AccessTokenClaims | null;
}

export function decideMiddlewareAuth(
  pathname: string,
  token: JWT | null,
): MiddlewareAuthDecision {
  const isAuthenticated =
    !!token?.accessToken && token?.error !== "RefreshAccessTokenError";
  const claims = isAuthenticated ? getClaims(token) : null;
  const role = getRoleFromClaims(claims);
  const defaultRoute = getDefaultRouteFromClaims(claims);

  if (isAuthPagePath(pathname)) {
    if (isAuthenticated && defaultRoute && pathname !== defaultRoute) {
      return { action: "redirect", destination: defaultRoute };
    }
    return { action: "allow" };
  }

  if (!isDashboardPath(pathname)) {
    return { action: "allow" };
  }

  if (!isAuthenticated) {
    return {
      action: "redirect",
      destination: LOGIN_PATH,
      withCallback: true,
    };
  }

  if (!role || !defaultRoute || !isPathAllowedForRole(pathname, role)) {
    return {
      action: "redirect",
      destination: defaultRoute ?? LOGIN_PATH,
    };
  }

  return { action: "allow" };
}
