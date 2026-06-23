import { backendGet, backendPost } from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import {
  mapChangedValuesToRequest,
  mapMetricValuesToDraft,
} from "@/modules/company/client-metric-value.mappers";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import { getClientMetricDefinitionFieldGroups } from "@/services/company/client-metric-definition.service";
import { getCompanyClientById } from "@/services/company/company.service";
import type {
  ClientMetricValueRequestBody,
  CompanyClientMetricValueDraftResult,
  SaveClientMetricValuesInput,
  SearchClientMetricValueResponseBody,
} from "@/types/dashboard/client-metric-value";

const COMPANY_API_BASE = "/api/companies";

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

function clientMetricValueBase(companyId: string, clientId: string) {
  return `${COMPANY_API_BASE}/${companyId}/clients/${clientId}/client-metric-value`;
}

export async function getClientMetricValues(
  clientId: string,
): Promise<SearchClientMetricValueResponseBody> {
  const companyId = await requireCompanyId();

  return backendGet<SearchClientMetricValueResponseBody>(
    clientMetricValueBase(companyId, clientId),
  );
}

export async function createClientMetricValues(
  clientId: string,
  body: ClientMetricValueRequestBody,
) {
  const companyId = await requireCompanyId();

  return backendPost(
    clientMetricValueBase(companyId, clientId),
    body,
  );
}

export async function getCompanyClientMetricValueDraft(
  clientId: string,
): Promise<CompanyClientMetricValueDraftResult | null> {
  const client = await getCompanyClientById(clientId);
  if (!client) {
    return null;
  }

  const [definitionGroups, metricValues] = await Promise.all([
    getClientMetricDefinitionFieldGroups(),
    getClientMetricValues(clientId),
  ]);

  return {
    metricValues,
    draft: mapMetricValuesToDraft(
      definitionGroups,
      metricValues,
      clientId,
      getCompanyClientFullName(client),
    ),
  };
}

export async function saveCompanyClientMetricValues(
  clientId: string,
  input: SaveClientMetricValuesInput,
): Promise<CompanyClientMetricValueDraftResult> {
  const payload = mapChangedValuesToRequest(
    input.values,
    input.originalValues,
    input.fieldMeta,
  );

  if (payload.values.length > 0) {
    await createClientMetricValues(clientId, payload);
  }

  const result = await getCompanyClientMetricValueDraft(clientId);
  if (!result) {
    throw new Error("Client not found.");
  }

  return result;
}
