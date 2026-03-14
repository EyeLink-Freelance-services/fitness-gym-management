import {
  CLIENT_NAV,
  COMPANY_NAV,
  PERSONAL_COACH_NAV,
  SUPER_ADMIN_NAV,
} from "@/data/sidebar/dashboard-nav";
import { NavItem, NavSection } from "@/types/dashboard/dashboard-shared";

export function section(label: string, items: NavItem[]): NavSection {
  return { label, items };
}

export function getDashboardNav(pathname: string): NavSection[] {
  if (pathname.startsWith("/dashboard/super-admin")) return SUPER_ADMIN_NAV;
  if (pathname.startsWith("/dashboard/company")) return COMPANY_NAV;
  if (pathname.startsWith("/dashboard/personal-coach"))
    return PERSONAL_COACH_NAV;
  if (pathname.startsWith("/dashboard/client")) return CLIENT_NAV;
  return [];
}
