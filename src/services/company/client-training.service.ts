import {
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import {
  extractTrainingPlansFromSearchResponse,
  mapClientTrainingResponseToRows,
  sortTrainingRows,
} from "@/modules/company/client-training.mappers";
import type {
  ClientTrainingPlanRequestApiBean,
  ClientTrainingPlanSearchSortField,
  SearchClientTrainingPlansApiBean,
} from "@/types/dashboard/client-training";
import type { GetPageParams } from "@/types/dashboard/shared";

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const { getAuthContext } = await import("@/lib/auth/get-auth-context");
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

function clientTrainingPlansBase(companyId: string, clientId: string) {
  return `${COMPANY_API_BASE}/${companyId}/client/${clientId}/training-plans`;
}

export async function getClientTrainingPlans(
  clientId: string,
  {
    pageNumber = 0,
    pageSize = 10,
    sort,
    descendingSort = true,
  }: GetPageParams & {
    sort?: ClientTrainingPlanSearchSortField;
    descendingSort?: boolean;
  } = {},
) {
  const companyId = await requireCompanyId();
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    descendingSort: String(descendingSort),
  });

  if (sort) {
    params.set("sort", sort);
  }

  const data = await backendGet<SearchClientTrainingPlansApiBean>(
    `${clientTrainingPlansBase(companyId, clientId)}?${params.toString()}`,
  );

  const rawPlans = extractTrainingPlansFromSearchResponse(data);
  const trainingPlans = sortTrainingRows(
    rawPlans.flatMap(mapClientTrainingResponseToRows),
  );

  return {
    trainingPlans,
    rawPlans,
    totalCount: data.totalElements ?? trainingPlans.length,
  };
}

export async function createClientTrainingPlan(
  clientId: string,
  body: ClientTrainingPlanRequestApiBean,
) {
  const companyId = await requireCompanyId();

  await backendPost<unknown>(
    clientTrainingPlansBase(companyId, clientId),
    body,
  );
}

export async function updateClientTrainingPlan(
  clientId: string,
  trainingPlanId: string,
  body: ClientTrainingPlanRequestApiBean,
) {
  const companyId = await requireCompanyId();

  await backendPut(
    `${clientTrainingPlansBase(companyId, clientId)}/${trainingPlanId}`,
    body,
  );
}
