import { cache } from "react";
import { getPermissionStringTable } from "../formatters/format-permission";
import { supabaseServer } from "../supabase/server";
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
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("ensure_active_company_or_personal_workspace");

  if (error) throw error;

  return await buildAuthContext(data);
});
