import { supabaseServer } from "@/lib/supabase/server";
import type { MemberCreateInput, MemberUpdateInput, MemberWithMembershipInput } from "@/lib/validation/schemas/member";
import { MemberMembershipCreateInput } from "@/lib/validation/schemas/member-membership";

const TABLE = "members";

/**
 * Expect a table like:
 * members: id (uuid), first_name, last_name, email, phone, status, created_at
 * Use RLS policies to restrict by workspace/tenant as needed.
 */
export async function listMembers() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMember(id: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMember(payload: MemberCreateInput) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function createMemberWithMembershipPlan(payloadMember: MemberCreateInput, payloadMemberMembership: MemberMembershipCreateInput) {
  const supabase = await supabaseServer();

  const {data: {user}, error: authError} = await supabase.auth.getUser();

  if(authError) throw authError
	if (!user) throw new Error("User not authenticated");

  const payloadMemberWithMembershipPlan: MemberWithMembershipInput = {
    p_company_id: payloadMember.company_id,
    p_assigned_coach_id: payloadMember.assigned_coach_id ?? null,
    p_first_name: payloadMember.first_name,
    p_last_name: payloadMember.last_name,
    p_member_code: payloadMember.member_code ?? null,
    p_dob: payloadMember.dob,
    p_gender: payloadMember.gender ?? null,
    p_phone: payloadMember.phone,
    p_email: payloadMember.email,
    p_address: payloadMember.address ?? null,
    p_medical_notes: payloadMember.medical_notes ?? null,
    p_emergency_contact_name: payloadMember.emergency_contact_name ?? null,
    p_emergency_contact_phone: payloadMember.emergency_contact_phone,
    p_member_status: payloadMember.status ?? "active",
    p_created_by: user.id,
    p_plan_id: payloadMemberMembership.plan_id,
    p_end_date: payloadMemberMembership.end_date,
    p_start_date: payloadMemberMembership.start_date,
    p_membership_status: payloadMemberMembership.status ?? "active",
  }

  const { data, error } = await supabase.rpc("create_member_with_membership", payloadMemberWithMembershipPlan);

  if (error) throw error;

  return data;
}

export async function updateMember(id: string, payload: MemberUpdateInput) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("id, first_name, last_name, email, phone, status, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMember(id: string) {
  const supabase = await supabaseServer();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}
