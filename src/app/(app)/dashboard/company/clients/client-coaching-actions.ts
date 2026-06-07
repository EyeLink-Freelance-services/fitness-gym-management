"use server";

import {
  getCompanyClientDietPlans,
  getCompanyClientTrainingPlans,
  saveCompanyClientDietPlan,
  saveCompanyClientTrainingPlan,
} from "@/modules/company/company-client-coaching.service";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export async function fetchCompanyClientDietPlansAction(clientId: string) {
  return getCompanyClientDietPlans(clientId);
}

export async function fetchCompanyClientTrainingPlansAction(clientId: string) {
  return getCompanyClientTrainingPlans(clientId);
}

export async function saveCompanyClientDietPlanAction(
  clientId: string,
  record: CoachDietPlanRecord,
) {
  const saved = await saveCompanyClientDietPlan(clientId, record);
  revalidatePath(clientProfilePath(clientId));
  return saved;
}

export async function saveCompanyClientTrainingPlanAction(
  clientId: string,
  record: CoachTrainingPlanRecord,
) {
  const saved = await saveCompanyClientTrainingPlan(clientId, record);
  revalidatePath(clientProfilePath(clientId));
  return saved;
}
