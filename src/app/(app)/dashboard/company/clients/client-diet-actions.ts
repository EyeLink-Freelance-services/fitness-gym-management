"use server";

import { getClientDiets } from "@/services/company/client-diet.service";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export async function fetchClientDietsPage(
  clientId: string,
  pageNumber: number,
  pageSize: number,
  mealDescription?: string,
  descendingSort = true,
) {
  const { diets, totalCount } = await getClientDiets(clientId, {
    pageNumber,
    pageSize,
    mealDescription,
    descendingSort,
  });

  return {
    diets,
    totalCount,
  };
}

export async function revalidateClientProfileAction(clientId: string) {
  revalidatePath(clientProfilePath(clientId));
}
