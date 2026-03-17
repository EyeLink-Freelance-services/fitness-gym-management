import { IAuthContext } from "@/types/auth-context";
import { getAuthContext } from "./get-auth-context";
import { NavItem, NavSection, SubItem } from "@/types/dashboard/dashboard-shared";
import { AuthPermission } from "@/constants/permission";

export async function requirePermission(permission: string) {
  const auth = await getAuthContext();

  if(auth?.isOwner) return auth;

  if (!auth || !auth.permissions.includes(permission)) {
    throw new Error("UNAUTHORIZED");
  }

  return auth;
}

function isPersonalOwner(auth?: IAuthContext) {
  return auth?.isOwner && auth?.company.mode === "personal";
}

function isCompanyCoach(auth?: IAuthContext) {
  return (
    auth?.company?.mode === "company" &&
    auth?.permissions?.includes(AuthPermission.dashboard.companyCoach) &&
    !auth?.permissions?.includes(AuthPermission.dashboard.company)
  );
}

function canAccessItem(item: NavItem | SubItem, auth?: IAuthContext) {
  const personalOwner = isPersonalOwner(auth);
  const companyCoachOnly = isCompanyCoach(auth);

  if (personalOwner) {
    const blockedPermissions = [
      AuthPermission.tasks.view,
      AuthPermission.tasks.edit,
      AuthPermission.dashboard.company,
      AuthPermission.dashboard.superAdmin,
    ] as string[];

    if (item.permission && blockedPermissions.includes(item.permission)) {
      return false;
    }

    return true;
  }

  // Company coach: hide company coach nav if they have full company access (admin)
  if (companyCoachOnly && item.permission === AuthPermission.dashboard.company) {
    return false;
  }

  if (!item.permission) {
    return true;
  }

  return auth?.permissions?.includes(item.permission) ?? false;
}

export function getAuthorizedNav(
  itemSections: NavSection[],
  auth: IAuthContext | undefined
): NavSection[] {
  return itemSections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          const filteredChildren =
            item.items?.filter((child) => canAccessItem(child, auth)) ?? [];

          return {
            ...item,
            items: filteredChildren,
          };
        })
        .filter((item) => {
          const hasVisibleChildren = item.items && item.items.length > 0;
          const canAccessSelf = canAccessItem(item, auth);

          return canAccessSelf || hasVisibleChildren;
        }),
    }))
    .filter((section) => section.items.length > 0);
}

export function getRedirectPathForAuth(auth: IAuthContext | null): string | null {
  if (!auth) return null;

  if (auth.permissions?.includes(AuthPermission.dashboard.companyCoach) && !auth.permissions?.includes(AuthPermission.dashboard.company)) {
    return "/dashboard/company";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.personalCoach) && auth.company?.mode === "personal") {
    return "/dashboard/personal-coach";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.superAdmin)) {
    return "/dashboard/super-admin";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.company)) {
    return "/dashboard/company";
  }

  return null;
}

