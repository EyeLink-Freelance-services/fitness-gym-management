import {
  backendDelete,
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import {
  mapFormToMetricDefinitionRequest,
  mapMetricDefinitionsToFieldGroups,
} from "@/modules/company/client-metric-definition.mappers";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type {
  MetricDefinitionFormValues,
  SearchClientMetricDefinitionsApiBean,
} from "@/types/dashboard/client-metric-definition";

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

export async function getClientMetricDefinitionFieldGroups(): Promise<
  FieldGroup[]
> {
  const companyId = await requireCompanyId();

  const data = await backendGet<SearchClientMetricDefinitionsApiBean>(
    `${COMPANY_API_BASE}/${companyId}/client-metric-definitions?pageNumber=0&pageSize=200`,
  );

  return mapMetricDefinitionsToFieldGroups(data.definitions ?? []);
}

export async function createClientMetricDefinition(
  values: MetricDefinitionFormValues,
) {
  const companyId = await requireCompanyId();

  return backendPost(
    `${COMPANY_API_BASE}/${companyId}/client-metric-definitions`,
    mapFormToMetricDefinitionRequest(values),
  );
}

export async function updateClientMetricDefinition(
  clientMetricDefinitionId: string,
  values: MetricDefinitionFormValues,
) {
  const companyId = await requireCompanyId();

  return backendPut(
    `${COMPANY_API_BASE}/${companyId}/client-metric-definitions/${clientMetricDefinitionId}`,
    mapFormToMetricDefinitionRequest(values),
  );
}

export async function deleteClientMetricDefinition(
  clientMetricDefinitionId: string,
) {
  const companyId = await requireCompanyId();

  return backendDelete(
    `${COMPANY_API_BASE}/${companyId}/client-metric-definitions/${clientMetricDefinitionId}`,
  );
}
