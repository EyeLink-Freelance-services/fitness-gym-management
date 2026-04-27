import {
  CLIENT_NAV,
  COMPANY_COACH_NAV,
  COMPANY_NAV,
  PERSONAL_COACH_NAV,
  SUPER_ADMIN_NAV,
} from "@/data/sidebar/dashboard-nav";
import { NavItem, NavSection } from "@/types/dashboard/dashboard-shared";
import { AuthPermission } from "@/constants/permission";
import type { IAuthContext } from "@/types/auth/auth-context";

export function section(label: string, items: NavItem[]): NavSection {
  return { label, items };
}

function isCompanyCoachOnly(auth?: IAuthContext | null): boolean {
  return (
    !!auth?.permissions?.includes(AuthPermission.dashboard.companyCoach) &&
    !auth?.permissions?.includes(AuthPermission.dashboard.company)
  );
}

function getNavByAuth(auth?: IAuthContext | null): NavSection[] {
  if (!auth?.permissions?.length) return [];
  if (auth.permissions.includes(AuthPermission.dashboard.superAdmin))
    return SUPER_ADMIN_NAV;
  if (auth.permissions.includes(AuthPermission.dashboard.client))
    return CLIENT_NAV;
  if (auth.permissions.includes(AuthPermission.dashboard.personalCoach))
    return PERSONAL_COACH_NAV;
  if (isCompanyCoachOnly(auth)) return COMPANY_COACH_NAV;
  if (auth.permissions.includes(AuthPermission.dashboard.company))
    return COMPANY_NAV;
  return [];
}

export function getDashboardNav(
  pathname: string,
  auth?: IAuthContext | null
): NavSection[] {
  if (pathname.startsWith("/dashboard/super-admin")) return SUPER_ADMIN_NAV;
  if (pathname.startsWith("/dashboard/company")) {
    return isCompanyCoachOnly(auth) ? COMPANY_COACH_NAV : COMPANY_NAV;
  }
  if (pathname.startsWith("/dashboard/personal-coach"))
    return PERSONAL_COACH_NAV;
  if (pathname.startsWith("/dashboard/client")) return CLIENT_NAV;
  return getNavByAuth(auth);
}
