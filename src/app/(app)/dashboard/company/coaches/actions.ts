"use server";

import {
  createCoachService,
  getCompanyCoaches,
  updateCoachService,
} from "@/services/company/company.service";
import type { PersonalCoachFormData } from "@/types/forms";
import { revalidatePath } from "next/cache";

export async function createCoachAction(data: PersonalCoachFormData) {
  const result = await createCoachService(data);
  revalidatePath("/dashboard/company/coaches");
  return result;
}

export async function updateCoachAction(
  coachId: string,
  data: PersonalCoachFormData,
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
  const { coaches } = await getCompanyCoaches({
    pageNumber: 0,
    pageSize: 100,
  });

  return coaches.map((coach) => ({
    value: coach.id,
    label: `${coach.first_name} ${coach.last_name}`.trim(),
  }));
}
