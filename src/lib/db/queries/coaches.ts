import { getServerDbClient } from "@/lib/db/server-client";

const TABLE_VIEW = "v_company_coaches";

export async function getCoachesByACompany(company_id: string) {
  const db = await getServerDbClient();
  const { data, error } = await db
    .from(TABLE_VIEW)
    .select('*')
    .eq("company_id", company_id)

  if (error) throw error;
  return data;
}