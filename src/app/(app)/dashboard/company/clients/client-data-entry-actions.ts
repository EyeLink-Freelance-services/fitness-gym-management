"use server";

import {
  getCompanyClientRecordDraft,
  saveCompanyClientRecordDraft,
  type SaveCompanyClientRecordDraftInput,
} from "@/modules/company/company-client-data-entry.service";
import { revalidatePath } from "next/cache";

function clientProfilePath(clientId: string) {
  return `/dashboard/company/clients/${clientId}`;
}

export async function fetchCompanyClientRecordDraftAction(clientId: string) {
  return getCompanyClientRecordDraft(clientId);
}

export async function saveCompanyClientRecordDraftAction(
  clientId: string,
  input: SaveCompanyClientRecordDraftInput,
) {
  const saved = await saveCompanyClientRecordDraft(clientId, input);
  revalidatePath(clientProfilePath(clientId));
  revalidatePath(`/dashboard/company/data-entry?clientId=${clientId}`);
  return saved;
}
