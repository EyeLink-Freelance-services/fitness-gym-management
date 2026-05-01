import {
  CLIENT_NAV,
  COMPANY_COACH_NAV,
  COMPANY_NAV,
  PERSONAL_COACH_NAV,
  SUPER_ADMIN_NAV,
} from "@/data/sidebar/dashboard-nav";
import { NavSection } from "@/types/dashboard/dashboard-shared";
import { AuthPermission } from "@/constants/permission";
import type { IAuthContext } from "@/types/auth/auth-context";

function isCompanyCoachOnly(auth?: IAuthContext | null): boolean {
  return (
    !!auth?.permissions?.includes(AuthPermission.dashboard.companyCoach) &&
    !auth?.permissions?.includes(AuthPermission.dashboard.company)
  );
}

export function getDashboardNav(
  _pathname: string,
  auth?: IAuthContext | null,
): NavSection[] {
  if (!auth?.permissions?.length) return [];

  if (auth.roles.includes('Super Admin'))
    return SUPER_ADMIN_NAV;

  if (auth.permissions.includes(AuthPermission.dashboard.personalCoach))
    return PERSONAL_COACH_NAV;

  if (isCompanyCoachOnly(auth)) return COMPANY_COACH_NAV;

  if (auth.permissions.includes(AuthPermission.dashboard.company))
    return COMPANY_NAV;

  if (auth.permissions.includes(AuthPermission.dashboard.client))
    return CLIENT_NAV;

  return [];
}
