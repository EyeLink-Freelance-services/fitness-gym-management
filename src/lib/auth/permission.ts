import { IAuthContext } from "@/types/auth-context";
import { getAuthContext } from "./get-auth-context";
import { NavItem, NavSection, SubItem } from "@/types/dashboard";
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

function canAccessItem(item: NavItem | SubItem, auth?: IAuthContext) {
  const personalOwner = isPersonalOwner(auth);

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

  if (!item.permission) {
    return true;
  }

  return auth?.permissions?.includes(item.permission) ?? false;
}

export function getAuthorizedNav(
  itemSections: NavSection[],
  auth: IAuthContext | undefined
): NavSection[] {
  console.log("auth", auth);
console.log("permissions", auth?.permissions);
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

