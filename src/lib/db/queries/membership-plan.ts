import { supabaseServer } from "@/lib/supabase/server";
import { MembershipPlanCreateInput, MembershipPlanEditInput } from "@/lib/validation/schemas/membership-plan";

const TABLE = "membership_plans";

/**
 * Expect a table like:
 * membership_plans: id (uuid), company_id (uuid), name, price, entree_fee, duration_days, is_monthly, description, is_active
 * Use RLS policies to restrict by workspace/tenant as needed.
 */
export async function listMembershipPlan() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMembershipPlan(id: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMembershipPlan(payload: MembershipPlanCreateInput) {
  const supabase = await supabaseServer();

  const {data: {user}, error: authError} = await supabase.auth.getUser();

  if(authError) throw authError

  const payloadComplete = {
    ...payload,
    created_by: user?.id,
    updated_by: user?.id
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payloadComplete)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMembershipPlan(payload: MembershipPlanEditInput) {
  const supabase = await supabaseServer();

  const {data: {user}, error: authError} = await supabase.auth.getUser();

  if(authError) throw authError
	if (!user) throw new Error("User not authenticated");

  const { id: _id, created_by, created_at, updated_at, ...rest } = payload as any;

  const payloadComplete = {
    ...rest,
    updated_by: user.id,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .update(payloadComplete)
    .eq("id", payload.id)
    .select("*")
    .single()

  if (error) throw error;
  return data;
}

export async function deleteMembershipPlan(id: string) {
  const supabase = await supabaseServer();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}
