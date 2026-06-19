"use server";

import { getClientTrainingPlans } from "@/services/company/client-training.service";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export async function fetchClientTrainingPlansPage(
  clientId: string,
  pageNumber: number,
  pageSize: number,
  descendingSort = true,
) {
  const { trainingPlans, totalCount } = await getClientTrainingPlans(clientId, {
    pageNumber,
    pageSize,
    descendingSort,
  });

  return {
    trainingPlans,
    totalCount,
  };
}

export async function revalidateClientProfileAction(clientId: string) {
  revalidatePath(clientProfilePath(clientId));
}
