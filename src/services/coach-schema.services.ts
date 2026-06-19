import {
  COMPANY_FIELD_GROUPS,
  COMPANY_FORMULAS,
} from "@/data/company-schema";
import {
  COACH_DIET_PLAN_RECORDS,
  COACH_PROGRESS_RECORDS,
  COACH_PROGRESS_SERIES,
  COACH_PROGRESS_SUMMARY,
  COACH_TRAINING_PLAN_RECORDS,
  COMPANY_RECORD_DRAFTS,
} from "@/data/coach-progress";

async function withLatency<T>(value: T) {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
}

export async function getCompanyFieldGroups() {
  return withLatency(COMPANY_FIELD_GROUPS);
}

export async function getCompanyFormulas() {
  return withLatency(COMPANY_FORMULAS);
}

export async function getCompanyRecordDraft(clientId = "client-wei-liang") {
  const rawDraft =
    COMPANY_RECORD_DRAFTS[clientId] ?? COMPANY_RECORD_DRAFTS["client-wei-liang"];
  return withLatency({
    ...rawDraft,
    computedMetrics: [],
    formulaSnapshots: [],
    previousMetrics: [],
  });
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
