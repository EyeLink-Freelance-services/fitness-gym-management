import { IAuthContext } from "@/types/auth-context";
import { getAuthContext } from "./get-auth-context";
import { NavItem, NavSection, SubItem } from "@/types/dashboard/dashboard-shared";
import { AuthPermission } from "@/constants/permission";
import { ROUTES } from "@/constants/route";

export async function requirePermission(permission: string) {
  const auth = await getAuthContext();

  console.log(auth?.permissions)
  if(auth?.isOwner) return auth;


  const authPermissions = new Set(auth?.permissions as string[]);
  
  if (!auth || !authPermissions.has(permission)) {
    throw new Error("UNAUTHORIZED");
  }

  return auth;
}

function isPersonalOwner(auth?: IAuthContext) {
  return auth?.isOwner && auth?.company.mode === "personal";
}

function canAccessItem(item: NavItem | SubItem, auth?: IAuthContext) {
  const authPermissions = new Set(auth?.permissions as string[]);
  const personalOwner = isPersonalOwner(auth);

  // Need to block some permissions nav because of role admin has full access <> Personal coach has admin role when created 
  if (personalOwner) {
    const blockedPermissions = new Set([
      AuthPermission.tasks.view,
      AuthPermission.dashboard.company,
      AuthPermission.dashboard.superAdmin,
      AuthPermission.dashboard.companyCoach,
      AuthPermission.coach.view,
      AuthPermission.staff.view,
    ] as string[]);

    if (item.permission && blockedPermissions.has(item.permission)) {
      return false;
    }

    return true;
  }

  // no permission restriction -> display it
  if (!item.permission) {
    return true;
  }

  return authPermissions.has(item.permission) ?? false;
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

export function getRedirectPathForAuth(auth: IAuthContext | undefined): string | null {
  const permissions = new Set(auth?.permissions ?? []);

  console.log(permissions, 'permissions');

  if (auth?.profile?.is_super_admin) {
    return ROUTES.DASHBOARD.SUPER_ADMIN.ROOT;
  }

  if (permissions.has(AuthPermission.dashboard.company)) {
    return ROUTES.DASHBOARD.COMPANY.ROOT;
  }

  if (permissions.has(AuthPermission.dashboard.companyCoach)) {
    return ROUTES.DASHBOARD.COMPANY.COACH;
  }

  if (auth?.company?.mode === "personal") {
    return ROUTES.DASHBOARD.PERSONAL_COACH.ROOT;
  }

  if (permissions.has(AuthPermission.dashboard.client)) {
    return ROUTES.DASHBOARD.CLIENT.ROOT;
  }

  return null;
}

