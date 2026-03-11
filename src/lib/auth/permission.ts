import { getAuthContext } from "./get-auth-context";

export async function requirePermission(permission: string) {
  const auth = await getAuthContext();

  if(auth?.isOwner) return auth;

  if (!auth || !auth.permissions.includes(permission)) {
    throw new Error("UNAUTHORIZED");
  }

  return auth;
}