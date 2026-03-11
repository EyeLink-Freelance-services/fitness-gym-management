import { cache } from "react";
import { getPermissionStringTable } from "../formatters/format-permission";
import { supabaseServer } from "../supabase/server";

export const getAuthContext = cache(async () => {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("ensure_active_company_or_personal_workspace");

  if (error) throw error;

  const permissions = getPermissionStringTable(data.permissions)

  return {
    userId: data.profile.id,
    profile: data.profile,
    company: data.company,
    isOwner: data.company_user?.is_owner ?? false,
    roles: data.roles?.map((r: any) => r.name) ?? [],
    permissions,
  };

}) 
