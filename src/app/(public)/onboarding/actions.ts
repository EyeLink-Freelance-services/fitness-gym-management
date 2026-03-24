"use server";

import { revalidatePath } from "next/cache";
import {
  AcceptTermsSchema,
  OnboardingProfileSchema,
} from "@/lib/validation/schemas/onboarding";
import { acceptInviteTerms, completeOnboarding, createOnboardingInvite } from "@/lib/db/queries/onboarding";

export async function acceptInviteTermsAction(values: unknown) {
  const parsed = AcceptTermsSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
      message: "Invalid terms payload",
    };
  }

  try {
    const acceptance = await acceptInviteTerms(parsed.data);
    return {
      ok: true,
      data: acceptance,
      message: "Terms accepted successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? "Failed to accept terms",
    };
  }
}

export async function completeOnboardingAction(values: unknown) {
  const parsed = OnboardingProfileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
      message: "Invalid onboarding payload",
    };
  }

  try {
    const result = await completeOnboarding(parsed.data);

    revalidatePath("/auth/sign-in");
    return {
      ok: true,
      data: result,
      message: "Onboarding completed successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? "Failed to complete onboarding",
    };
  }
}