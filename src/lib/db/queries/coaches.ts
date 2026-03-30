"use server"

import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { CreateCompanyCoachValues } from "@/lib/validation/schemas/coach";
import { generateRandomPassword } from "../utils";

const TABLE_VIEW_LABEL = "v_company_coaches";
const TABLE_VIEW_COMPLETE = "v_company_coaches_complete";

export async function getCoachesCompany() {
  const auth = await requirePermission(AuthPermission.coach.view);

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE_VIEW_COMPLETE)
    .select('*')
    .eq("company_id", auth.companyId)

  if (error) throw error;
  return data;
}

export async function getCoachesByACompany(company_id: string) {
  const auth = await requirePermission(AuthPermission.coach.view);

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from(TABLE_VIEW_LABEL)
    .select('*')
    .eq("company_id", company_id)

  if (error) throw error;
  return data;
}

/**  
 * auth.signUp
 * profile insert
 * companies select by company_id
 * company_user insert
 * company_coach_details insert
 * company_user_role insert
 * */ 

export async function createCoach(payload: CreateCompanyCoachValues) {
  const auth = await requirePermission(AuthPermission.coach.edit);

  const adminSupabase = await supabaseAdmin();
  const supabase = await supabaseServer(); 

  const password = generateRandomPassword();

  const { data: userData, error: createUserError } = await adminSupabase.auth.admin.createUser({
    email: payload.email,
    password: password,
    email_confirm: true,
  });

  if (createUserError ) throw createUserError ;
  
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error("Failed to create user");
  }

  const { data, error } = await supabase.rpc("create_company_coach", {
    p_user_id: userId,
    p_company_id: auth.companyId,
    p_first_name: payload.first_name,
    p_last_name: payload.last_name,
    p_email: payload.email,
    p_phone: payload.phone,
    p_specialization: payload.specialization,
    p_certifications: payload.certifications,
    p_year_exp: payload.year_exp,
    p_bio: payload.bio,
    p_availability: payload.availability
  });

  if (error) {
    await supabase.auth.admin.deleteUser(userId);
    throw error;
  }
  return data;
}