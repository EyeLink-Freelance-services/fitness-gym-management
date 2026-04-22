import { getServerDbClient } from "@/lib/db/server-client";

export async function getCompanyOverview() {
  const db = await getServerDbClient();

	const { data , error } = await db.rpc("ensure_active_company");

  if (error) throw error;
  return data;
}