"use server";

import {
  createCoachService,
  getCompanyCoachOptions as getCompanyCoachOptionsService,
  getCompanyCoaches,
  searchCompanyCoachOptions as searchCompanyCoachOptionsService,
  updateCoachService,
} from "@/services/company/company.service";
import type { CoachFormData } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function createCoachAction(data: CoachFormData) {
  const result = await createCoachService(data);
  revalidatePath("/dashboard/company/coaches");
  return result;
}

export async function updateCoachAction(
  coachId: string,
  data: CoachFormData,
) {
  const result = await updateCoachService(coachId, data);
  revalidatePath("/dashboard/company/coaches");
  return result;
}

export async function fetchCompanyCoachPage(
  pageNumber: number,
  pageSize: number,
  search?: string,
) {
  const { coaches, totalCount } = await getCompanyCoaches({
    pageNumber,
    pageSize,
    search,
  });

  return {
    coaches,
    totalCount,
  };
}

export async function getCompanyCoachOptions() {
  return getCompanyCoachOptionsService();
}

export async function searchCompanyCoachOptions(search?: string) {
  return searchCompanyCoachOptionsService(search);
}
