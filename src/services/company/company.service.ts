import { backendGet, backendPost, backendPut} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import type {
  ClientResponseApiBean,
  CompanyClient,
  CompanyClientFormValues,
  CompanyPricing,
  SearchClientsApiBean,
  SearchCoachesApiBean,
} from "@/types/dashboard/company";
import type { CompanyResponseApiBean } from "@/types/dashboard/super-admin";
import { GetPageParams } from "@/types/dashboard/shared";
import type { CoachFormData } from "@/types/forms";
import { mapClientFormValuesToApiRequest, mapClientResponseToCompanyClient} from "@/modules/company/company-client.mappers";
import { mapCoachFormToApiRequest, mapCoachesToCoachOptions, mapCoachResponseToCompanyCoachesRow} from "@/modules/company/company-coach.mappers";
import type { AssignCoachOption } from "@/types/dashboard/assign-client";

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

export async function getCompanyClientByUserId(
  clientUserId: string,
): Promise<CompanyClient | null> {
  try {
    const companyId = await requireCompanyId();
    const data = await backendGet<ClientResponseApiBean>(
      `${COMPANY_API_BASE}/${companyId}/clients/users/${clientUserId}`,
    );
    return mapClientResponseToCompanyClient(data);
  } catch {
    return null;
  }
}

export async function getMyCompanyClientProfile(): Promise<CompanyClient | null> {
  const auth = await getAuthContext();
  if (!auth?.userId) return null;

  return getCompanyClientByUserId(auth.userId);
}

export async function getCompanyClientForCurrentUser(): Promise<CompanyClient | null> {
  return getMyCompanyClientProfile();
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

export async function getCompanyCoachOptions(): Promise<AssignCoachOption[]> {
  return searchCompanyCoachOptions();
}

export async function searchCompanyCoachOptions(
  search?: string,
): Promise<AssignCoachOption[]> {
  const { coaches } = await getCompanyCoaches({
    pageNumber: 0,
    pageSize: 20,
    search,
  });

  return mapCoachesToCoachOptions(coaches);
}

export async function getCompanyCoaches({
  pageNumber = 0,
  pageSize = 10,
  search,
  sort = "CREATION_DATE",
  descendingSort = true,
}: GetPageParams & {
  search?: string;
  sort?: string;
  descendingSort?: boolean;
} = {}) {
  const companyId = await requireCompanyId();
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    descendingSort: String(descendingSort),
    sort,
  });

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    if (trimmedSearch.includes("@")) {
      params.set("email", trimmedSearch);
    } else if (/^[+\d\s-]+$/.test(trimmedSearch)) {
      params.set("contactNumber", trimmedSearch);
    } else {
      params.set("firstName", trimmedSearch);
    }
  }

  const data = await backendGet<SearchCoachesApiBean>(
    `${COMPANY_API_BASE}/${companyId}/coaches?${params.toString()}`,
  );

  return {
    coaches: (data.coaches ?? []).map(mapCoachResponseToCompanyCoachesRow),
    totalCount: data.totalElements ?? 0,
  };
}

export async function createCoachService(form: CoachFormData) {
  const companyId = await requireCompanyId();

  return await backendPost(
    `${COMPANY_API_BASE}/${companyId}/coaches`,
    mapCoachFormToApiRequest(form),
  );
}

export async function updateCoachService(
  coachId: string,
  form: CoachFormData,
) {
  const companyId = await requireCompanyId();

  return await backendPut(
    `${COMPANY_API_BASE}/${companyId}/coaches/${coachId}`,
    mapCoachFormToApiRequest(form),
  );
}
