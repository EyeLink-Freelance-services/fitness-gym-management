"use server";

import { saveCompanyClientMetricValues } from "@/services/company/client-metric-value.service";
import type { SaveClientMetricValuesInput } from "@/types/dashboard/client-metric-value";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/route";

export async function saveClientMetricValuesAction(
  clientId: string,
  input: SaveClientMetricValuesInput,
) {
  const saved = await saveCompanyClientMetricValues(clientId, input);
  revalidatePath(ROUTES.DASHBOARD.COMPANY.CLIENT_DATA_ENTRY(clientId));
  revalidatePath(ROUTES.DASHBOARD.COMPANY.CLIENT_PROFILE(clientId));
  return saved;
}
