"use server";

import {
  createClientService,
  getCompanyClientById,
  getCompanyClients,
  getCompanyPricingForCompany,
  getMyCompanyClientProfile,
  updateClientService,
} from "@/services/company/company.service";
import { fetchClientDietsPage } from "@/app/(app)/dashboard/company/clients/client-diet-actions";
import { fetchClientTrainingPlansPage } from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
import { getClientCoachDisplayName } from "@/modules/company/company-client.mappers";
import { getClientTrainingSessionRows } from "@/services/company/training-session.service";
import type {
  CompanyClientFormValues,
  CompanyClient,
  CompanyPricing,
} from "@/types/dashboard/company";
import type {
  ClientDietPlanRow,
  ClientTrainingPlanRow,
  ClientTrainingSessionRow,
} from "@/types/dashboard/client";
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
  revalidatePath(`/dashboard/company/clients/${clientId}`);
  return result;
}

export async function fetchCompanyClientPage(
  pageNumber: number,
  pageSize: number,
  search?: string,
) {
  const { clients, totalCount } = await getCompanyClients({
    pageNumber,
    pageSize,
    search,
  });

  return {
    clients,
    totalCount,
  };
}

export async function fetchCoachClientPage(
  pageNumber: number,
  pageSize: number,
  search?: string,
) {
  const { clients, totalCount } = await getCompanyClients({
    pageNumber,
    pageSize,
    search,
  });

  return {
    clients,
    totalCount,
  };
}

export async function getCompanyClientAction(clientId: string) {
  return getCompanyClientById(clientId);
}

export async function loadCurrentClientProfile() {
  const client = await getMyCompanyClientProfile();
  if (!client) return null;

  return loadClientProfileData(client.id, {
    skipCompanyPricing: true,
    client,
  });
}

export async function loadClientProfileData(
  clientId: string,
  options?: { skipCompanyPricing?: boolean; client?: CompanyClient | null },
) {
  const [client, companyPricing] = await Promise.all([
    options?.client
      ? Promise.resolve(options.client)
      : getCompanyClientById(clientId),
    options?.skipCompanyPricing
      ? Promise.resolve(null)
      : getCompanyPricingForCompany().catch(() => null),
  ]);

  if (!client) return null;

  const isPersonalCoaching = client.membershipPlan === "PERSONAL";
  const coachName = getClientCoachDisplayName(client);
  const [initialDietsResult, initialTrainingPlansResult, initialTrainingSessions] =
    isPersonalCoaching
      ? await Promise.all([
          fetchClientDietsPage(clientId, 0, 100).catch(() => ({
            diets: [] as ClientDietPlanRow[],
          })),
          fetchClientTrainingPlansPage(clientId, 0, 100).catch(() => ({
            trainingPlans: [] as ClientTrainingPlanRow[],
          })),
          getClientTrainingSessionRows(clientId, coachName).catch(
            () => [] as ClientTrainingSessionRow[],
          ),
        ])
      : [
          { diets: [] as ClientDietPlanRow[] },
          { trainingPlans: [] as ClientTrainingPlanRow[] },
          [] as ClientTrainingSessionRow[],
        ];

  return {
    client,
    companyPricing,
    initialDiets: initialDietsResult.diets,
    initialTrainingPlans: initialTrainingPlansResult.trainingPlans,
    initialTrainingSessions,
  };
}
