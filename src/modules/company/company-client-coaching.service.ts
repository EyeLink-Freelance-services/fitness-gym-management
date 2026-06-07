import {
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import {
  mapDietPlanFormToApiRequest,
  mapDietPlanResponseToRecord,
  mapTrainingPlanFormToApiRequest,
  mapTrainingPlanResponseToRecord,
} from "@/modules/company/company-client-coaching.mappers";
import {
  COACH_DIET_PLAN_RECORDS,
  COACH_TRAINING_PLAN_RECORDS,
} from "@/data/coach-progress";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import type {
  ClientDietPlanResponseApiBean,
  ClientTrainingPlanResponseApiBean,
  SearchClientDietPlansApiBean,
  SearchClientTrainingPlansApiBean,
} from "@/types/dashboard/company-client-coaching";

const COMPANY_API_BASE = "/api/companies";

const dietPlansStore = new Map<string, CoachDietPlanRecord[]>(
  Object.entries(COACH_DIET_PLAN_RECORDS),
);
const trainingPlansStore = new Map<string, CoachTrainingPlanRecord[]>(
  Object.entries(COACH_TRAINING_PLAN_RECORDS),
);

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

function clientResourceBase(companyId: string, clientId: string) {
  return `${COMPANY_API_BASE}/${companyId}/clients/${clientId}`;
}

function readDietPlans(clientId: string) {
  return [...(dietPlansStore.get(clientId) ?? [])];
}

function readTrainingPlans(clientId: string) {
  return [...(trainingPlansStore.get(clientId) ?? [])];
}

function upsertDietPlan(clientId: string, record: CoachDietPlanRecord) {
  const current = readDietPlans(clientId).filter((plan) => plan.id !== record.id);
  dietPlansStore.set(clientId, [record, ...current]);
  return record;
}

function upsertTrainingPlan(
  clientId: string,
  record: CoachTrainingPlanRecord,
) {
  const current = readTrainingPlans(clientId).filter(
    (plan) => plan.id !== record.id,
  );
  trainingPlansStore.set(clientId, [record, ...current]);
  return record;
}

export async function getCompanyClientDietPlans(
  clientId: string,
): Promise<CoachDietPlanRecord[]> {
  try {
    const companyId = await requireCompanyId();
    const data = await backendGet<SearchClientDietPlansApiBean>(
      `${clientResourceBase(companyId, clientId)}/diet-plans`,
    );

    return (data.dietPlans ?? []).map((plan) =>
      mapDietPlanResponseToRecord(plan, clientId),
    );
  } catch {
    return readDietPlans(clientId);
  }
}

export async function getCompanyClientTrainingPlans(
  clientId: string,
): Promise<CoachTrainingPlanRecord[]> {
  try {
    const companyId = await requireCompanyId();
    const data = await backendGet<SearchClientTrainingPlansApiBean>(
      `${clientResourceBase(companyId, clientId)}/training-plans`,
    );

    return (data.trainingPlans ?? []).map((plan) =>
      mapTrainingPlanResponseToRecord(plan, clientId),
    );
  } catch {
    return readTrainingPlans(clientId);
  }
}

export async function saveCompanyClientDietPlan(
  clientId: string,
  record: CoachDietPlanRecord,
): Promise<CoachDietPlanRecord> {
  const payload = mapDietPlanFormToApiRequest(record);
  const isUpdate = readDietPlans(clientId).some((plan) => plan.id === record.id);

  try {
    const companyId = await requireCompanyId();
    const base = `${clientResourceBase(companyId, clientId)}/diet-plans`;

    const response = isUpdate
      ? await backendPut<ClientDietPlanResponseApiBean>(
          `${base}/${record.id}`,
          payload,
        )
      : await backendPost<ClientDietPlanResponseApiBean>(base, payload);

    if (response && "id" in response && response.id) {
      return mapDietPlanResponseToRecord(response, clientId);
    }
  } catch {
    // Fall back to local store when API is unavailable.
  }

  return upsertDietPlan(clientId, record);
}

export async function saveCompanyClientTrainingPlan(
  clientId: string,
  record: CoachTrainingPlanRecord,
): Promise<CoachTrainingPlanRecord> {
  const payload = mapTrainingPlanFormToApiRequest(record);
  const isUpdate = readTrainingPlans(clientId).some(
    (plan) => plan.id === record.id,
  );

  try {
    const companyId = await requireCompanyId();
    const base = `${clientResourceBase(companyId, clientId)}/training-plans`;

    const response = isUpdate
      ? await backendPut<ClientTrainingPlanResponseApiBean>(
          `${base}/${record.id}`,
          payload,
        )
      : await backendPost<ClientTrainingPlanResponseApiBean>(base, payload);

    if (response && "id" in response && response.id) {
      return mapTrainingPlanResponseToRecord(response, clientId);
    }
  } catch {
    // Fall back to local store when API is unavailable.
  }

  return upsertTrainingPlan(clientId, record);
}
