import { supabaseServer } from "@/lib/supabase/server";
import type { MemberCreateInput, MemberUpdateInput } from "@/lib/validation/schemas/member";

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
    .select("id, first_name, last_name, email, phone, status, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMember(id: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, first_name, last_name, email, phone, status, created_at")
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
