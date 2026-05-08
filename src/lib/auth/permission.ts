import { IAuthContext } from "@/types/auth/auth-context";
import { getAuthContext } from "./get-auth-context";
import { getDefaultRouteFromAuthContext } from "@/config/routes.config";

export async function requirePermission(permission: string) {
  const auth = await getAuthContext();

  if (auth?.isOwner) return auth;

  if (!auth || !auth.permissions.includes(permission)) {
    throw new Error("UNAUTHORIZED");
  }

  return auth;
}

export function getRedirectPathForAuth(
  auth: IAuthContext | null,
): string | null {
  return getDefaultRouteFromAuthContext(auth);
}
