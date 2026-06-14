"use server";

import { fetchClientDietsPage } from "@/app/(app)/dashboard/company/clients/client-diet-actions";
import { fetchClientTrainingPlansPage } from "@/app/(app)/dashboard/company/clients/client-training-actions";
import { mapCoachMealToApiRequest } from "@/modules/company/client-diet.mappers";
import {
  getAvailableTrainingDays,
  getExistingPlanId,
  getFilledTrainingEntriesFromForm,
  isTrainingPlanConflict,
  mapTrainingPlanToApiRequest,
  resolvePlanId,
} from "@/modules/company/client-training.mappers";
import {
  createClientDiets,
  updateClientDiet,
} from "@/services/company/client-diet.service";
import {
  createClientTrainingPlan,
  getClientTrainingPlans,
  updateClientTrainingPlan,
} from "@/services/company/client-training.service";
import type {
  ClientTrainingPlanRow,
  CoachDietPlanRecord,
} from "@/types/dashboard/client";
import type { PersonalCoachTrainingPlanFormData } from "@/types/forms";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export { fetchClientDietsPage, fetchClientTrainingPlansPage };

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

async function resolvePlanIdForClient(clientId: string) {
  const { trainingPlans, rawPlans } = await getClientTrainingPlans(clientId, {
    pageNumber: 0,
    pageSize: 100,
  });

  const planIdFromRows = getExistingPlanId(trainingPlans);
  if (planIdFromRows) {
    return { planId: planIdFromRows, rows: trainingPlans };
  }

  const planIdFromRaw = rawPlans.map(resolvePlanId).find(Boolean);
  if (planIdFromRaw) {
    return { planId: planIdFromRaw, rows: trainingPlans };
  }

  return { planId: undefined, rows: trainingPlans };
}

export async function saveCompanyClientTrainingPlanAction(
  clientId: string,
  values: PersonalCoachTrainingPlanFormData,
  existingRows: ClientTrainingPlanRow[],
  editingRowId?: string,
) {
  if (editingRowId) {
    const row = existingRows.find((entry) => entry.id === editingRowId);

    if (!row) {
      throw new Error("Training plan not found.");
    }

    await updateClientTrainingPlan(
      clientId,
      row.planId,
      mapTrainingPlanToApiRequest(existingRows, values, [row.day]),
    );
    revalidatePath(clientProfilePath(clientId));
    return;
  }

  const availableDays = getAvailableTrainingDays(existingRows);
  const entries = getFilledTrainingEntriesFromForm(values, availableDays);
  const daysToAdd = entries.map((entry) => entry.day);
  const body = mapTrainingPlanToApiRequest(existingRows, values, daysToAdd);
  let planId = getExistingPlanId(existingRows);

  if (planId) {
    await updateClientTrainingPlan(clientId, planId, body);
    revalidatePath(clientProfilePath(clientId));
    return;
  }

  try {
    await createClientTrainingPlan(clientId, body);
  } catch (error) {
    if (!isTrainingPlanConflict(error)) {
      throw error;
    }

    const resolved = await resolvePlanIdForClient(clientId);
    planId = resolved.planId;

    if (!planId) {
      throw error;
    }

    await updateClientTrainingPlan(
      clientId,
      planId,
      mapTrainingPlanToApiRequest(resolved.rows, values, daysToAdd),
    );
  }

  revalidatePath(clientProfilePath(clientId));
}
