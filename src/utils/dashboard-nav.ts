import { NavSection } from "@/types/dashboard/dashboard-shared";
import type { IAuthContext } from "@/types/auth/auth-context";
import { getSidebarNavForRole } from "@/config/sidebar.config";
import { getRoleFromAuthContext } from "@/config/routes.config";

export function getDashboardNav(
  _pathname: string,
  auth?: IAuthContext | null,
): NavSection[] {
  const role = getRoleFromAuthContext(auth ?? null);
  return getSidebarNavForRole(role);
}
