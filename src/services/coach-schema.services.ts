import {
  COACH_DIET_PLAN_RECORDS,
  COACH_PROGRESS_RECORDS,
  COACH_PROGRESS_SERIES,
  COACH_PROGRESS_SUMMARY,
  COACH_TRAINING_PLAN_RECORDS,
} from "@/data/coach-progress";

async function withLatency<T>(value: T) {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
}

export async function getCompanyProgressOverview() {
  return withLatency({
    summaryCards: COACH_PROGRESS_SUMMARY,
    series: COACH_PROGRESS_SERIES,
    records: COACH_PROGRESS_RECORDS,
  });
}

export async function getCompanyDietPlans(clientId?: string) {
  const resolvedClientId = clientId ?? "client-wei-liang";
  return withLatency(COACH_DIET_PLAN_RECORDS[resolvedClientId] ?? []);
}

export async function getCompanyTrainingPlans(clientId?: string) {
  const resolvedClientId = clientId ?? "client-wei-liang";
  return withLatency(COACH_TRAINING_PLAN_RECORDS[resolvedClientId] ?? []);
}
