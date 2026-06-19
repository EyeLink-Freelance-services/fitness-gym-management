import { backendGet, backendPost, backendPut } from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { COMPANY_FIELD_GROUPS } from "@/data/company-schema";
import {
  buildClientRecordDraft,
  seedFieldValuesFromProfile,
} from "@/modules/client-records/client-record-draft.mappers";
import { getCompanyClientById } from "@/services/company/company.service";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import type { ClientRecordDraft } from "@/types/dashboard/client-records";
import type {
  ClientRecordDraftApiBean,
  ClientRecordDraftRequestApiBean,
} from "@/types/dashboard/company-client-coaching";

const COMPANY_API_BASE = "/api/companies";

type StoredRecordDraft = Omit<
  ClientRecordDraft,
  "computedMetrics" | "previousMetrics" | "formulaSnapshots"
>;

const recordDraftStore = new Map<string, StoredRecordDraft>();

async function requireCompanyId(): Promise<string> {
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

function clientRecordsBase(companyId: string, clientId: string) {
  return `${COMPANY_API_BASE}/${companyId}/clients/${clientId}/records`;
}

function toStoredDraft(draft: ClientRecordDraft): StoredRecordDraft {
  return {
    clientId: draft.clientId,
    clientName: draft.clientName,
    sessionDate: draft.sessionDate,
    notes: draft.notes,
    groups: draft.groups,
    values: draft.values,
  };
}

function mapApiDraftToRecord(
  api: ClientRecordDraftApiBean,
  clientId: string,
  clientName: string,
): ClientRecordDraft {
  return buildClientRecordDraft({
    clientId,
    clientName,
    groups: COMPANY_FIELD_GROUPS,
    values: api.values ?? {},
    notes: api.notes ?? "",
    sessionDate: api.sessionDate ?? new Date().toISOString().split("T")[0],
  });
}

function createDraftForClient(
  clientId: string,
  clientName: string,
  dateOfBirth?: string,
  stored?: StoredRecordDraft,
): ClientRecordDraft {
  if (stored) {
    return buildClientRecordDraft({
      clientId,
      clientName,
      groups: COMPANY_FIELD_GROUPS,
      values: stored.values,
      notes: stored.notes,
      sessionDate: stored.sessionDate,
    });
  }

  return buildClientRecordDraft({
    clientId,
    clientName,
    groups: COMPANY_FIELD_GROUPS,
    values: seedFieldValuesFromProfile(COMPANY_FIELD_GROUPS, { dateOfBirth }),
  });
}

export async function getCompanyClientRecordDraft(
  clientId: string,
): Promise<ClientRecordDraft | null> {
  const client = await getCompanyClientById(clientId);
  if (!client) {
    return null;
  }

  const clientName = getCompanyClientFullName(client);

  try {
    const companyId = await requireCompanyId();
    const api = await backendGet<ClientRecordDraftApiBean>(
      `${clientRecordsBase(companyId, clientId)}/draft`,
    );

    return mapApiDraftToRecord(api, clientId, clientName);
  } catch {
    const stored = recordDraftStore.get(clientId);
    return createDraftForClient(
      clientId,
      clientName,
      client.dateOfBirth,
      stored,
    );
  }
}

export type SaveCompanyClientRecordDraftInput = {
  values: Record<string, string>;
};

export async function saveCompanyClientRecordDraft(
  clientId: string,
  input: SaveCompanyClientRecordDraftInput,
): Promise<ClientRecordDraft> {
  const client = await getCompanyClientById(clientId);
  if (!client) {
    throw new Error("Client not found.");
  }

  const clientName = getCompanyClientFullName(client);
  const sessionDate = new Date().toISOString().split("T")[0];
  const draft = buildClientRecordDraft({
    clientId,
    clientName,
    groups: COMPANY_FIELD_GROUPS,
    values: input.values,
    notes: "",
    sessionDate,
  });

  const payload: ClientRecordDraftRequestApiBean = {
    sessionDate,
    notes: "",
    values: input.values,
  };

  try {
    const companyId = await requireCompanyId();
    const base = `${clientRecordsBase(companyId, clientId)}/draft`;

    try {
      await backendPut<ClientRecordDraftApiBean>(base, payload);
    } catch {
      await backendPost(base, payload);
    }
  } catch {
    // Persist locally when the API is unavailable.
  }

  recordDraftStore.set(clientId, toStoredDraft(draft));
  return draft;
}
