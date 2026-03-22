"use server"

import { createAssignment } from "@/lib/db/queries/assign-members-coach";
import { getDietPlan, listDietPlan, saveDietPlan } from "@/lib/db/queries/diet-plans";
import { DietPlanFormInput, DietPlanFormSchema, DietPlanFormValues } from "@/lib/validation/schemas/diet-plans";
import { DietPlan } from "@/types/diet-plan";
import { revalidatePath } from "next/cache";
import { DietPlanListRow } from "./components/diet-plan-list";


type AssignDietPlanInput = {
  companyId: string;
  dietPlanId: string;
  memberIds: string[];
  assigned_by: string;
  startDate: string;
};

export async function assignDietPlanToMembersAction({
  companyId,
  dietPlanId,
  memberIds,
  assigned_by,
  startDate,
}: AssignDietPlanInput) {
  try {
    // await requirePermission(AuthPermission.diet_plans.update);

    if (!memberIds.length) {
      return {
        ok: false,
        message: "No members selected",
      };
    }

    const payload = memberIds.map((memberId) => ({
      company_id: companyId,
      diet_plan_id: dietPlanId,
      member_id: memberId,
      assigned_by: assigned_by,
      start_date: startDate,
      status: "active" as const,
    }));

    const data = await createAssignment("diet", payload); 

    return {
      ok: true,
      data,
      message: "Diet plan assigned successfully",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? "Failed to assign diet plan",
    };
  }
}


export async function getDietPlanAction(id: string) {
  try {
    const dietPlan: DietPlanFormInput= await getDietPlan(id);
    console.log(dietPlan, 'diet plan')

    return {
      ok: true,
      data: dietPlan
    };

  } catch (error: any) {
    return {
      ok: false,
      message: error.message ?? 'failed to get diet plan'
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
    const dietPlan: DietPlanListRow[] = await listDietPlan();

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