import type { AccessTokenClaims } from "@/types/auth/token";
import {
  getDefaultRouteFromClaims,
  getDefaultRouteForRole,
  getRoleFromClaims,
  isPathAllowedForRole,
} from "@/config/routes.config";

// Backward-compatible exports while route authorization now lives in routes.config.ts.
export function getDefaultRoute(permissions: readonly string[]): string {
  const claims: AccessTokenClaims = { permissions: [...permissions] };
  return getDefaultRouteFromClaims(claims) ?? "/auth/sign-in";
}

export function isRouteAllowed(
  pathname: string,
  permissions: readonly string[],
): boolean {
  const role = getRoleFromClaims({ permissions: [...permissions] });
  return isPathAllowedForRole(pathname, role);
}

export function getDashboardFromContextType(
  contextType?: string | null,
): string | null {
  const role = getRoleFromClaims({ contextType: contextType ?? undefined });
  return getDefaultRouteForRole(role);
}

export function getDashboardFromClaims(
  claims: AccessTokenClaims | null,
): string | null {
  return getDefaultRouteFromClaims(claims);
}

