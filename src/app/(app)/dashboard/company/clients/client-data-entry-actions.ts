"use server";

import {
  getCompanyClientMetricValueDraft,
  saveCompanyClientMetricValues,
} from "@/services/company/client-metric-value.service";
import type { SaveClientMetricValuesInput } from "@/types/dashboard/client-metric-value";
import { ROUTES } from "@/constants/route";
import { revalidatePath } from "next/cache";

export async function fetchCompanyClientMetricValueDraftAction(clientId: string) {
  return getCompanyClientMetricValueDraft(clientId);
}

export async function saveCompanyClientMetricValuesAction(
  clientId: string,
  input: SaveClientMetricValuesInput,
) {
  const saved = await saveCompanyClientMetricValues(clientId, input);
  revalidatePath(ROUTES.DASHBOARD.COMPANY.CLIENT_PROFILE(clientId));
  revalidatePath(ROUTES.DASHBOARD.COMPANY.CLIENT_DATA_ENTRY(clientId));
  return saved;
}
