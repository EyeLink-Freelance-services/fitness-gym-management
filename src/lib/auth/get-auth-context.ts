import { cache } from "react";
import { getPermissionStringTable } from "../formatters/format-permission";
import { getServerDbClient } from "../db/server-client";
import type { IAuthContext } from "@/types/auth-context";

export async function buildAuthContext(data: any): Promise<IAuthContext> {
  const permissions = getPermissionStringTable(data.permissions ?? []);

  return {
    userId: data.profile.id,
    profile: data.profile,
    companyId: data.company?.id ?? data.profile.active_company_id ?? null,
    company: data.company,
    isOwner: data.company_user?.is_owner ?? false,
    roles: data.roles?.map((r: any) => r.name) ?? [],
    permissions,
  };
}

export const getAuthContext = cache(async (): Promise<IAuthContext | null> => {
  const db = await getServerDbClient();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return null;

  const { data, error } = await db.rpc("ensure_active_company_or_personal_workspace");

  if (error) throw error;

  return await buildAuthContext(data);
});
