"use server"

import { getDietPlan, listDietPlan, saveDietPlan } from "@/lib/db/queries/diet-plans";
import { DietPlanFormInput, DietPlanFormSchema, DietPlanFormValues } from "@/lib/validation/schemas/diet-plans";
import { DietPlan } from "@/types/diet-plan";
import { revalidatePath } from "next/cache";

export async function getDietPlanAction(id: string) {
  try {
    const dietPlan: DietPlanFormInput= await getDietPlan(id);

    return {
      ok: true,
      data: dietPlan
    };

  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? 'failed to list diet plan'
    }
  }
}

export async function saveDietPlanAction(values: DietPlanFormValues) {
  const parsed = DietPlanFormSchema.safeParse(values);
  console.log(parsed, 'parsed')

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten(),
      message: 'Invalid payload'
    };
  }

  try {
    const dietPlan: string = await saveDietPlan(parsed.data);
    console.log(dietPlan, 'dietPlan');
    revalidatePath('/diet-plans');

    return {
      ok: true,
      data: dietPlan
    };
  } catch (error: any) {
      return {
        ok: false,
        message: error.message ?? 'failed to save diet plan'
      }
  }
}


export async function listDietPlanAction() {

    try {
        const dietPlan: DietPlan[] = await listDietPlan();

        return {
                ok: true,
                data: dietPlan
        };

    } catch (error: any) {
        return {
            ok: false,
            message: error.message ?? 'failed to list diet plan'
        }
    }
}