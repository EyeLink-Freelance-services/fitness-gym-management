import { IAuthContext } from "@/types/auth/auth-context";
import { getAuthContext } from "./get-auth-context";
import { AuthPermission } from "@/constants/permission";

export async function requirePermission(permission: string) {
  const auth = await getAuthContext();

  if(auth?.isOwner) return auth;

  if (!auth || !auth.permissions.includes(permission)) {
    throw new Error("UNAUTHORIZED");
  }

  return auth;
}

export function getRedirectPathForAuth(auth: IAuthContext | null): string | null {
  if (!auth) return null;

  if (auth.permissions?.includes(AuthPermission.dashboard.companyCoach) && !auth.permissions?.includes(AuthPermission.dashboard.company)) {
    return "/dashboard/company";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.personalCoach) && auth.company?.mode === "personal") {
    return "/dashboard/personal-coach";
  }
  if (
    auth.permissions?.includes(AuthPermission.dashboard.superAdmin) ||
    auth.company?.mode === "super-admin"
  ) {
    return "/dashboard/super-admin";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.company)) {
    return "/dashboard/company";
  }
  if (auth.permissions?.includes(AuthPermission.dashboard.client)) {
    return "/dashboard/client";
  }

  return null;
}

