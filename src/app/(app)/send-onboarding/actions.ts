"use server"

import { createOnboardingInvite } from "@/lib/db/queries/onboarding";
import { InviteCreateSchema, InviteCreateValues } from "@/lib/validation/schemas/onboarding";
import { revalidatePath } from "next/cache";

export async function createOnboardingInviteAction(values: InviteCreateValues) {
  const parsed = InviteCreateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
      message: "Invalid payload for onboarding invite",
    };
  }

  try {
    const invite = await createOnboardingInvite(parsed.data);

    revalidatePath("/onboarding");

    return {
      ok: true,
      data: invite,
      message: "Invitation created successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? "Failed to create invitation",
    };
  }
}