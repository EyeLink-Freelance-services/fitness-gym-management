import { AuthPermission } from "@/constants/permission";
import { ROUTES } from "@/constants/route";
import type { IAuthContext } from "@/types/auth/auth-context";
import type { AccessTokenClaims } from "@/types/auth/token";

export type AppRole =
  | "super-admin"
  | "company"
  | "company-coach"
  | "client";

type RoleRouteConfig = {
  defaultRoute: string;
  allowedRoutes: readonly string[];
};

export const AUTH_PAGE_PREFIXES = [
  "/auth",
  "/sign-in",
  "/login",
] as const;

export const DASHBOARD_ROOT_PREFIX = "/dashboard";

export const ROUTE_CONFIG: Record<AppRole, RoleRouteConfig> = {
  "super-admin": {
    defaultRoute: ROUTES.DASHBOARD.SUPER_ADMIN.ROOT,
    allowedRoutes: [ROUTES.DASHBOARD.SUPER_ADMIN.ROOT],
  },
  company: {
    defaultRoute: ROUTES.DASHBOARD.COMPANY.ROOT,
    allowedRoutes: [ROUTES.DASHBOARD.COMPANY.ROOT],
  },
  "company-coach": {
    defaultRoute: ROUTES.DASHBOARD.COMPANY.ROOT,
    allowedRoutes: [ROUTES.DASHBOARD.COMPANY.ROOT],
  },
  client: {
    defaultRoute: ROUTES.DASHBOARD.COMPANY.ROOT,
    allowedRoutes: [ROUTES.DASHBOARD.COMPANY.ROOT],
  },
} as const;

const DASHBOARD_PERMISSION_ROLE_PRIORITY: Array<[string, AppRole]> = [
  [AuthPermission.dashboard.superAdmin, "super-admin"],
  [AuthPermission.dashboard.company, "company"],
  [AuthPermission.dashboard.companyCoach, "company-coach"],
  [AuthPermission.dashboard.client, "client"],
];

function normalize(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

function inferRoleFromContextType(contextType?: string | null): AppRole | null {
  const context = normalize(contextType);
  if (!context) return null;

  if (context.includes("super")) return "super-admin";
  if (context.includes("client")) return "client";
  if (context.includes("company")) return "company";

  return null;
}

function inferRoleFromPermissions(permissions: readonly string[] = []): AppRole | null {
  for (const [permission, role] of DASHBOARD_PERMISSION_ROLE_PRIORITY) {
    if (permissions.includes(permission)) return role;
  }
  return null;
}

function inferRoleFromRoleNames(roles: readonly string[] = []): AppRole | null {
  for (const roleName of roles) {
    const role = normalize(roleName);
    if (!role) continue;

    if (role.includes("super")) return "super-admin";
    if (role.includes("client")) return "client";
    if (role.includes("company") && role.includes("coach")) return "company-coach";
    if (role === "admin" || role.includes("company")) return "company";
  }

  return null;
}

function resolveAppRole(
  contextType: string | null | undefined,
  permissions: readonly string[] = [],
  roleNames: readonly string[] = [],
): AppRole | null {
  if (roleNames.some((role) => normalize(role) === "client")) {
    return "client";
  }

  const fromContext = inferRoleFromContextType(contextType);

  if (fromContext && fromContext !== "company") {
    return fromContext;
  }

  const fromPermissions = inferRoleFromPermissions(permissions);
  if (fromPermissions) return fromPermissions;

  const fromRoles = inferRoleFromRoleNames(roleNames);
  if (fromRoles) return fromRoles;

  return fromContext;
}

function enforceCompanyCoachByPermission(
  role: AppRole | null,
  permissions: readonly string[] = [],
): AppRole | null {
  const hasCompanyCoach = permissions.includes(AuthPermission.dashboard.companyCoach);
  const hasCompanyAdmin = permissions.includes(AuthPermission.dashboard.company);

  if (hasCompanyCoach && !hasCompanyAdmin) {
    return "company-coach";
  }

  return role;
}

export function getRoleFromClaims(claims: AccessTokenClaims | null): AppRole | null {
  if (!claims) return null;

  const permissions = claims.permissions ?? [];
  const candidate = resolveAppRole(
    claims.contextType,
    permissions,
    claims.roles ?? [],
  );

  return enforceCompanyCoachByPermission(candidate, permissions);
}

export function getRoleFromAuthContext(auth: IAuthContext | null): AppRole | null {
  if (!auth) return null;

  const candidate =
    resolveAppRole(auth.contextType, auth.permissions ?? [], auth.roles ?? []) ??
    (auth.company?.mode ? inferRoleFromContextType(auth.company.mode) : null);

  return enforceCompanyCoachByPermission(candidate, auth.permissions ?? []);
}

export function getDefaultRouteForRole(role: AppRole | null): string | null {
  if (!role) return null;
  return ROUTE_CONFIG[role].defaultRoute;
}

export function getAllowedRoutesForRole(role: AppRole | null): readonly string[] {
  if (!role) return [];
  return ROUTE_CONFIG[role].allowedRoutes;
}

export function isAuthPagePath(pathname: string): boolean {
  return AUTH_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isDashboardPath(pathname: string): boolean {
  return (
    pathname === DASHBOARD_ROOT_PREFIX ||
    pathname.startsWith(`${DASHBOARD_ROOT_PREFIX}/`)
  );
}

export function isPathAllowedForRole(pathname: string, role: AppRole | null): boolean {
  if (!role) return false;

  if (role === "client") {
    return pathname === ROUTES.DASHBOARD.COMPANY.ROOT;
  }

  const allowedRoutes = getAllowedRoutesForRole(role);
  return allowedRoutes.some((prefix) => pathname.startsWith(prefix));
}

export function getDefaultRouteFromClaims(claims: AccessTokenClaims | null): string | null {
  return getDefaultRouteForRole(getRoleFromClaims(claims));
}

export function getDefaultRouteFromAuthContext(auth: IAuthContext | null): string | null {
  return getDefaultRouteForRole(getRoleFromAuthContext(auth));
}
