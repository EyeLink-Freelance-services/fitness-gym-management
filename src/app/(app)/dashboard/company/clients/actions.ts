"use server";

import {
  createClientService,
  updateClientService,
} from "@/modules/company/company.service";
import type { CompanyPricing } from "@/types/dashboard/company";
import type { ClientFormData } from "@/types/forms";

export async function createClientAction(
  data: ClientFormData,
  companyPlan?: CompanyPricing | null,
) {
  return await createClientService(data, companyPlan);
}

export async function updateClientAction(
  clientId: string,
  data: ClientFormData,
  companyPlan?: CompanyPricing | null,
) {
  return await updateClientService(clientId, data, companyPlan);
}
