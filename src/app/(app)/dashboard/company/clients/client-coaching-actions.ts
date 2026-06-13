"use server";

import { fetchClientDietsPage } from "@/app/(app)/dashboard/company/clients/client-diet-actions";
import {
  getCompanyClientTrainingPlans,
  saveCompanyClientTrainingPlan,
} from "@/modules/company/company-client-coaching.service";
import { mapCoachMealToApiRequest } from "@/modules/company/client-diet.mappers";
import {
  createClientDiets,
  updateClientDiet,
} from "@/services/company/client-diet.service";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export { fetchClientDietsPage };

export async function fetchCompanyClientTrainingPlansAction(clientId: string) {
  return getCompanyClientTrainingPlans(clientId);
}

export async function saveCompanyClientDietPlanAction(
  clientId: string,
  record: CoachDietPlanRecord,
  dietId?: string,
) {
  const meals = record.meals.map(mapCoachMealToApiRequest);

  if (dietId) {
    await updateClientDiet(clientId, dietId, meals[0]);
  } else {
    await createClientDiets(clientId, meals);
  }

  revalidatePath(clientProfilePath(clientId));
}

export async function saveCompanyClientTrainingPlanAction(
  clientId: string,
  record: CoachTrainingPlanRecord,
) {
  const saved = await saveCompanyClientTrainingPlan(clientId, record);
  revalidatePath(clientProfilePath(clientId));
  return saved;
}
