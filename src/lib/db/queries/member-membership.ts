import { supabaseServer } from "@/lib/supabase/server";
import { MemberMembershipCreateInput, MemberMembershipUpdateInput } from "@/lib/validation/schemas/member-membership";

const TABLE = "member_memberships";

/**
 * Expect a table like:
 * member_memberships: 
		id uuid primary key default gen_random_uuid(),
		company_id uuid not null references public.companies(id) on delete cascade,
		member_id uuid not null references public.members(id) on delete cascade,
		plan_id uuid not null references public.membership_plans(id) on delete restrict,
		start_date date not null,
		end_date date not null,
		status text not null default 'active' check (status in ('active','expired','cancelled')),
 * Use RLS policies to restrict by workspace/tenant as needed.
 */
export async function listmemberMembership() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMemberMembership(id: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getMembershipPlanByMemberIdAndCompanyId(idMember: string, idCompany: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("member_id", idMember)
    .eq("company_id", idCompany)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMemberMembership(payload:  MemberMembershipCreateInput) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMemberMembership(id: string, payload: MemberMembershipUpdateInput) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMemberMembership(id: string) {
  const supabase = await supabaseServer();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}
