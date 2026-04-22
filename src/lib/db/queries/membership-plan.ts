import { getServerDbClient } from "@/lib/db/server-client";
import { MembershipPlanCreateInput, MembershipPlanEditInput } from "@/lib/validation/schemas/membership-plan";

const TABLE = "membership_plans";

/**
 * Expect a table like:
 * membership_plans: id (uuid), company_id (uuid), name, price, entree_fee, duration_days, is_monthly, description, is_active
 * Use RLS policies to restrict by workspace/tenant as needed.
 */
export async function listMembershipPlan() {
  const db = await getServerDbClient();

  const { data, error } = await db
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listMembershipPlanActive() {
  const db = await getServerDbClient();

  const { data, error } = await db
    .from(TABLE)
    .select("*")
		.eq('is_active', true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMembershipPlan(id: string) {
  const db = await getServerDbClient();

  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMembershipPlan(payload: MembershipPlanCreateInput) {
  const db = await getServerDbClient();

  const {data: {user}, error: authError} = await db.auth.getUser();

  if(authError) throw authError
	if (!user) throw new Error("User not authenticated");

	const { id: _id, created_by, created_at, updated_at, features,  ...rest } = payload as any;

  const payloadComplete = {
    ...rest,
		features: payload.features?.map((f) => f.value).filter(Boolean) ?? [],
    created_by: user?.id,
    updated_by: user?.id
  }

	console.log(payloadComplete, 'payloadComplet');
	
  const { data, error } = await db
    .from(TABLE)
    .insert(payloadComplete)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateMembershipPlan(payload: MembershipPlanEditInput) {
  const db = await getServerDbClient();

  const {data: {user}, error: authError} = await db.auth.getUser();

  if(authError) throw authError
	if (!user) throw new Error("User not authenticated");

  const { id: _id, created_by, created_at, updated_at, features,  ...rest } = payload as any;

  const payloadComplete = {
    ...rest,
		features: payload.features?.map((f) => f.value).filter(Boolean) ?? [],
    updated_by: user.id,
  };

  const { data, error } = await db
    .from(TABLE)
    .update(payloadComplete)
    .eq("id", payload.id)
    .select("*")
    .single()

  if (error) throw error;
  return data;
}

export async function deleteMembershipPlan(id: string) {
  const db = await getServerDbClient();
  const { error } = await db.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}
