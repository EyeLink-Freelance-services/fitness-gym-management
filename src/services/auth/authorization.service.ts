import type { IAuthContext } from "@/types/auth/auth-context";
import type { AccessTokenClaims } from "@/types/auth/token";
import {
  getDefaultRouteFromAuthContext,
  getDefaultRouteFromClaims,
  getRoleFromAuthContext,
  getRoleFromClaims,
  isPathAllowedForRole,
} from "@/config/routes.config";

export function getDashboardRedirectFromAuth(
  auth: IAuthContext | null,
): string | null {
  return getDefaultRouteFromAuthContext(auth);
}

export function getDashboardRedirectFromClaims(
  claims: AccessTokenClaims | null,
): string | null {
  return getDefaultRouteFromClaims(claims);
}

export function isDashboardRouteAuthorizedForAuth(
  pathname: string,
  auth: IAuthContext | null,
): boolean {
  const role = getRoleFromAuthContext(auth);
  return isPathAllowedForRole(pathname, role);
}

export function isDashboardRouteAuthorizedForClaims(
  pathname: string,
  claims: AccessTokenClaims | null,
): boolean {
  const role = getRoleFromClaims(claims);
  return isPathAllowedForRole(pathname, role);
}
