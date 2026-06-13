import {
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { mapClientDietResponseToRow } from "@/modules/company/client-diet.mappers";
import type { ClientDietPlanRow } from "@/types/dashboard/client";
import type {
  ClientDietRequestApiBean,
  ClientDietSearchSortField,
  DietsRequestApiBean,
  SearchClientDietsApiBean,
} from "@/types/dashboard/client-diet";
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

function clientDietsBase(companyId: string, clientId: string) {
  return `${COMPANY_API_BASE}/${companyId}/client/${clientId}/diets`;
}

export async function getClientDiets(
  clientId: string,
  {
    pageNumber = 0,
    pageSize = 10,
    mealDescription,
    sort,
    descendingSort = true,
  }: GetPageParams & {
    mealDescription?: string;
    sort?: ClientDietSearchSortField;
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

  if (mealDescription?.trim()) {
    params.set("mealDescription", mealDescription.trim());
  }

  const data = await backendGet<SearchClientDietsApiBean>(
    `${clientDietsBase(companyId, clientId)}?${params.toString()}`,
  );

  const diets = data.diets ?? [];

  return {
    diets: diets.map(mapClientDietResponseToRow),
    totalCount: data.totalElements ?? diets.length,
  };
}

export async function createClientDiets(
  clientId: string,
  diets: ClientDietRequestApiBean[],
) {
  const companyId = await requireCompanyId();
  const payload: DietsRequestApiBean = { diets };

  await backendPost<unknown>(
    clientDietsBase(companyId, clientId),
    payload,
  );
}

export async function updateClientDiet(
  clientId: string,
  dietId: string,
  body: ClientDietRequestApiBean,
) {
  const companyId = await requireCompanyId();

  await backendPut(
    `${clientDietsBase(companyId, clientId)}/${dietId}`,
    body,
  );
}

export async function getClientDietById(
  clientId: string,
  dietId: string,
): Promise<ClientDietPlanRow | null> {
  const { diets } = await getClientDiets(clientId, {
    pageNumber: 0,
    pageSize: 100,
  });

  return diets.find((diet) => diet.id === dietId) ?? null;
}
