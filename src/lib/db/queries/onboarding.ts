import { supabaseServer } from "@/lib/supabase/server";
import type {
  InviteCreateValues,
  OnboardingProfileValues,
} from "@/lib/validation/schemas/onboarding";
import { OnboardingInviteRow } from "../types";
import { generateToken, hashToken } from "@/lib/security/token";

const ONBOARDING_INVITES_TABLE = "onboarding_invites";
const ONBOARDING_INVITES_ACCEPTANCE_TABLE = "onboarding_invite_acceptance";


export async function createOnboardingInvite(payload: InviteCreateValues) {
  const supabase = await supabaseServer();

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + payload.expires_in_days);

  const { data: authUser } = await supabase.auth.getUser();
  if (!authUser.user) throw new Error("Unauthorized");

  const insertPayload = {
    email: payload.email.toLowerCase(),
    token: hashedToken,
    invitation_type: payload.invitation_type,
    company_name:
      payload.invitation_type === "company"
        ? payload.company_name?.trim() || null
        : null,
    note: payload.note?.trim() || null,
    expires_at: expiresAt.toISOString(),
    created_by: authUser.user.id,
    terms_version: payload.terms_version,
    privacy_version: payload.privacy_version,
  };

  const { data, error } = await supabase
    .from(ONBOARDING_INVITES_TABLE)
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) throw error;
  return {
    ...data,
    rawToken,
  } as OnboardingInviteRow & {rawToken: string};
}

export async function getInviteByToken(rawToken: string) {
  const supabase = await supabaseServer();

  const hashedToken = hashToken(rawToken);

  const { data, error } = await supabase.rpc("get_onboarding_invite_by_token", {
    p_token: hashedToken,
  });

  if (error) throw error;
  return data as OnboardingInviteRow[];
}

export async function acceptInviteTerms(input: {
  token: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
}) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc(
    "accept_onboarding_invite_terms",
    {
      p_token: input.token,
      p_accepted_terms: input.accepted_terms,
      p_accepted_privacy: input.accepted_privacy,
      p_ip_address: null,
      p_user_agent: null,
    }
  );

  if (error) throw error;
  return data;
}

export async function completeOnboarding(payload: OnboardingProfileValues) {
  const supabase = await supabaseServer();

  const hashedToken = hashToken(payload.token);

  const { data, error } = await supabase.rpc("complete_onboarding", {
    p_token: hashedToken,
    p_first_name: payload.first_name,
    p_last_name: payload.last_name,
    p_company_name: payload.company_name,
    p_company_email: payload.company_contact_email,
    p_company_phone: payload.company_contact_phone || null,
    p_picture_url: payload.picture_url || null,
    p_phone: payload.phone || null,
    p_company_logo_url: payload.company_logo_url || null,
    p_company_brn: payload.company_brn || null,
    p_company_address: payload.company_address || null,
    p_company_region: payload.company_region || null,
    p_company_post_code: payload.company_post_code || null,
    p_company_city: payload.company_city || null,
    p_company_terms: payload.company_terms || null,
    p_company_disclaimer: payload.company_disclaimer || null,
  });

  if (error) throw error;
  return data;
}