"use server";

import {
  createClientService,
  getCompanyClients,
  updateClientService,
} from "@/modules/company/company.service";
import type {
  CompanyClientFormValues,
  CompanyPricing,
} from "@/types/dashboard/company";
import { revalidatePath } from "next/cache";

export async function createClientAction(
  data: CompanyClientFormValues,
  companyPlan?: CompanyPricing | null,
) {
  const result = await createClientService(data, companyPlan);
  revalidatePath("/dashboard/company/clients");
  return result;
}

export async function updateClientAction(
  clientId: string,
  data: CompanyClientFormValues,
  companyPlan?: CompanyPricing | null,
) {
  const result = await updateClientService(clientId, data, companyPlan);
  revalidatePath("/dashboard/company/clients");
  return result;
}

export async function fetchCompanyClientPage(
  pageNumber: number,
  pageSize: number,
) {
  const { clients, totalCount } = await getCompanyClients({
    pageNumber,
    pageSize,
  });

  return {
    clients,
    totalCount,
  };
}
