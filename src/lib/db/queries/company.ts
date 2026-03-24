import { supabaseServer } from "@/lib/supabase/server";
import { CompanyCreateInput } from "@/lib/validation/schemas/company";
import { toCompanyInsert } from "../mappers/company";

const TABLE = "companies";

/**
 * Expect a table like:
 * members: id (uuid), first_name, last_name, email, phone, status, created_at
 * Use RLS policies to restrict by workspace/tenant as needed.
 */
export async function createCompany(payload: CompanyCreateInput) {
  const companyValues = toCompanyInsert(payload);
  
  const supabase = await supabaseServer();
  
	const { data, error } = await supabase
    .from(TABLE)
    .insert(companyValues)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}