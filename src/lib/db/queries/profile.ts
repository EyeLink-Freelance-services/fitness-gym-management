import { getServerDbClient } from "@/lib/db/server-client";
import { ProfileUpdateFormValues } from "@/lib/validation/schemas/profile";

const TABLE = "profiles";

/**
 * Expect a table like:
 * profile: id (uuid), first_name, last_name, email, phone, created_at, updated_at
 * Use RLS policies to restrict by workspace/tenant as needed.
 */

export async function updateProfile(id: string, payload: ProfileUpdateFormValues) {
  const db = await getServerDbClient();
  const { data, error } = await db
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(id: string) {
  const db = await getServerDbClient();

  const { data, error } = await db
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}