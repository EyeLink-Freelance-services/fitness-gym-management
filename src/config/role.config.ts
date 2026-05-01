import { AuthPermission } from "@/constants/permission";
import { ROUTES } from "@/constants/route";
import type { AccessTokenClaims } from "@/types/auth/token";


export const DASHBOARD_ROUTE_PERMISSIONS: Record<string, readonly string[]> = {
  "/dashboard/super-admin": [AuthPermission.dashboard.superAdmin],
  "/dashboard/personal-coach": [AuthPermission.dashboard.personalCoach],
  "/dashboard/company": [
    AuthPermission.dashboard.company,
    AuthPermission.dashboard.companyCoach,
  ],
  "/dashboard/client": [AuthPermission.dashboard.client],
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the canonical "home" dashboard path for the given permission set.
 * Falls back to the sign-in page if no recognised permission is present.
 */
export function getDefaultRoute(permissions: readonly string[]): string {
  if (permissions.includes(AuthPermission.dashboard.superAdmin)) {
    return ROUTES.DASHBOARD.SUPER_ADMIN.ROOT;
  }
  if (permissions.includes(AuthPermission.dashboard.personalCoach)) {
    return ROUTES.DASHBOARD.PERSONAL_COACH.ROOT;
  }
  // Company-coach-only users (have companyCoach but not full company admin)
  if (
    permissions.includes(AuthPermission.dashboard.companyCoach) &&
    !permissions.includes(AuthPermission.dashboard.company)
  ) {
    return ROUTES.DASHBOARD.COMPANY.ROOT;
  }
  if (permissions.includes(AuthPermission.dashboard.company)) {
    return ROUTES.DASHBOARD.COMPANY.ROOT;
  }
  if (permissions.includes(AuthPermission.dashboard.client)) {
    return ROUTES.DASHBOARD.CLIENT.ROOT;
  }
  return "/auth/sign-in";
}

/**
 * Returns `true` if the given pathname is accessible with the supplied
 * permission set.
 *
 * Non-dashboard routes are always considered allowed here; the middleware
 * only calls this function for `/dashboard/**` paths.
 */
export function isRouteAllowed(
  pathname: string,
  permissions: readonly string[],
): boolean {
  for (const [prefix, required] of Object.entries(DASHBOARD_ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      return required.some((p) => permissions.includes(p));
    }
  }

  return true;
}

// ---------------------------------------------------------------------------
// Context-based helpers (preferred for RBAC)
// ---------------------------------------------------------------------------

/**
 * Map a high-level auth context to its primary dashboard route.
 *
 * This is the preferred way to determine where a user should land after
 * authentication (e.g. SUPER_ADMIN, COMPANY, CLIENT).
 */
export function getDashboardFromContextType(
  contextType?: string | null,
): string | null {
  const ctx = (contextType ?? "").toUpperCase();

  if (ctx.includes("SUPER")) {
    return ROUTES.DASHBOARD.SUPER_ADMIN.ROOT;
  }

  if (ctx.includes("COMPANY")) {
    return ROUTES.DASHBOARD.COMPANY.ROOT;
  }

  if (ctx.includes("CLIENT")) {
    return ROUTES.DASHBOARD.CLIENT.ROOT;
  }

  return null;
}


export function getDashboardFromClaims(
  claims: AccessTokenClaims | null,
): string | null {
  if (!claims) return null;

  const byContext = getDashboardFromContextType(claims.contextType);
  if (byContext) return byContext;

  const perms = claims.permissions ?? [];
  const byPermissions = getDefaultRoute(perms);
  return byPermissions === "/auth/sign-in" ? null : byPermissions;
}

