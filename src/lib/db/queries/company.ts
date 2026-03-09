import { supabaseServer } from "@/lib/supabase/server";

export async function getCompanyOverview() {
  const supabase = await supabaseServer();
  
    // const {data: {session}} = await supabase.auth.getSession();
    // if(!session) return; //not logged in
  
	const { data , error } = await supabase.rpc("ensure_active_company");

  if (error) throw error;
  return data;
}