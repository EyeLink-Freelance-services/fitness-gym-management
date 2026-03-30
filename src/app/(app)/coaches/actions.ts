"use server"

import { createCoach, getCoachesCompany } from "@/lib/db/queries/coaches";
import { CreateCompanyCoachSchema, CreateCompanyCoachValues } from "@/lib/validation/schemas/coach";
import { CompanyCoachRow } from "@/types/dashboard/company-directory";
import { revalidatePath } from "next/cache";

export async function getCoachCompanyAction() {
  try {
    const coaches: CompanyCoachRow[] = await getCoachesCompany();

    return {
      ok: true,
      data: coaches
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? 'failed to get coaches'
    }
  }
}

export async function createCoachAction(values: CreateCompanyCoachValues) {
  const parsed = CreateCompanyCoachSchema.safeParse(values);

  if (!parsed.success) {
    return {
        ok: false,
        errors: parsed.error.flatten(),
        message: 'Invalid payload'
    };
  }

  try {
    const coaches = await createCoach(parsed.data);
    console.log(coaches, 'coach created');
    revalidatePath('/coaches')

    return coaches
  } catch (error: any) {
    return {
        ok: false,
        message: error.message ?? 'failed to create coach'
    }
  }
}