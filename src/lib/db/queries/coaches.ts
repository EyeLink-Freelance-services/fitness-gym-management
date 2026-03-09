import { supabaseServer } from "@/lib/supabase/server";

const TABLE_VIEW = "v_company_coaches";

export async function getCoachesByACompany(company_id: string) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE_VIEW)
    .select('*')
    .eq("company_id", company_id)

  if (error) throw error;
  return data;
}