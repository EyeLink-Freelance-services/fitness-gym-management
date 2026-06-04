import {
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type {
  ClientResponseApiBean,
  CompanyClient,
  CompanyClientFormValues,
  CompanyPricing,
  SearchClientsApiBean,
} from "@/types/dashboard/company";
import type { CompanyResponseApiBean } from "@/types/dashboard/super-admin";
import { GetPageParams } from "@/types/dashboard/shared";
import {
  mapClientFormValuesToApiRequest,
  mapClientResponseToCompanyClient,
} from "@/modules/company/company-client.mappers";

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

export async function getCompanyPricingForCompany(): Promise<CompanyPricing> {
  const companyId = await requireCompanyId();

  const company = await backendGet<CompanyResponseApiBean>(
    `${COMPANY_API_BASE}/${companyId}`,
  );

  return {
    standardPrice: company.price?.standardPrice ?? undefined,
    additionalFees: company.price?.additionalFees ?? undefined,
  };
}

export async function getCompanyClients({
  pageNumber = 0,
  pageSize = 10,
}: GetPageParams = {}) {
  const companyId = await requireCompanyId();

  const data = await backendGet<SearchClientsApiBean>(
    `${COMPANY_API_BASE}/${companyId}/clients?pageNumber=${pageNumber}&pageSize=${pageSize}&descendingSort=true`,
  );

  return {
    clients: (data.clients ?? []).map(mapClientResponseToCompanyClient),
    totalCount: data.totalElements ?? 0,
  };
}

export async function getCompanyLastFiveClients() {
  const { clients } = await getCompanyClients({ pageSize: 5 });
  return clients;
}

export async function getCompanyClientById(
  clientId: string,
): Promise<CompanyClient | null> {
  try {
    const companyId = await requireCompanyId();
    const data = await backendGet<ClientResponseApiBean>(
      `${COMPANY_API_BASE}/${companyId}/clients/${clientId}`,
    );
    return mapClientResponseToCompanyClient(data);
  } catch {
    return null;
  }
}

export async function createClientService(
  form: CompanyClientFormValues,
  _companyPlan?: CompanyPricing | null,
) {
  const companyId = await requireCompanyId();

  return await backendPost(
    `${COMPANY_API_BASE}/${companyId}/clients`,
    mapClientFormValuesToApiRequest(form),
  );
}

export async function updateClientService(
  clientId: string,
  form: CompanyClientFormValues,
  _companyPlan?: CompanyPricing | null,
) {
  const companyId = await requireCompanyId();

  return await backendPut(
    `${COMPANY_API_BASE}/${companyId}/clients/${clientId}`,
    mapClientFormValuesToApiRequest(form),
  );
}
