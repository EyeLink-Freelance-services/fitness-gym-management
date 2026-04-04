import {
  COMPANY_FIELD_GROUPS,
  COMPANY_FORMULAS,
  COMPANY_SCHEMA_SUMMARY,
  COMPANY_SCHEMA_VALIDATION_RULES,
} from "@/data/company-schema";
import {
  COACH_DIET_PLAN_RECORDS,
  COACH_PROGRESS_RECORDS,
  COACH_PROGRESS_SERIES,
  COACH_PROGRESS_SUMMARY,
  COACH_TRAINING_PLAN_RECORDS,
  COMPANY_RECORD_DRAFTS,
  COACH_RECORD_DRAFTS,
} from "@/data/coach-progress";
import { COACH_CLIENTS } from "@/data/coach-clients";
import {
  PERSONAL_COACH_FIELD_GROUPS,
  PERSONAL_COACH_FORMULAS,
  PERSONAL_COACH_SCHEMA_SUMMARY,
  PERSONAL_COACH_VALIDATION_RULES,
} from "@/data/personal-coach-schema";

async function withLatency<T>(value: T) {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return value;
}

export async function getCompanySchemaOverview() {
  return withLatency(COMPANY_SCHEMA_SUMMARY);
}

export async function getCompanyFieldGroups() {
  return withLatency(COMPANY_FIELD_GROUPS);
}

export async function getCompanySchemaValidationRules() {
  return withLatency(COMPANY_SCHEMA_VALIDATION_RULES);
}

export async function getCompanyFormulas() {
  return withLatency(COMPANY_FORMULAS);
}

export async function getPersonalCoachSchemaOverview() {
  return withLatency(PERSONAL_COACH_SCHEMA_SUMMARY);
}

export async function getPersonalCoachFieldGroups() {
  return withLatency(PERSONAL_COACH_FIELD_GROUPS);
}

export async function getPersonalCoachSchemaValidationRules() {
  return withLatency(PERSONAL_COACH_VALIDATION_RULES);
}

export async function getPersonalCoachFormulas() {
  return withLatency(PERSONAL_COACH_FORMULAS);
}

export async function getPersonalCoachClients() {
  return withLatency(COACH_CLIENTS);
}

export async function getPersonalCoachRecordDraft(
  clientId = "client-wei-liang",
) {
  const rawDraft =
    COACH_RECORD_DRAFTS[clientId] ?? COACH_RECORD_DRAFTS["client-wei-liang"];
  return withLatency({
    ...rawDraft,
    computedMetrics: [],
    formulaSnapshots: [],
    previousMetrics: [],
  });
}

export async function getPersonalCoachProgressOverview(clientId?: string) {
  const client = clientId
    ? COACH_CLIENTS.find((c) => c.id === clientId)
    : COACH_CLIENTS[0];
  return withLatency({
    client,
    summaryCards: COACH_PROGRESS_SUMMARY,
    series: COACH_PROGRESS_SERIES,
    records: COACH_PROGRESS_RECORDS,
  });
}

export async function getPersonalCoachDietPlans(clientId?: string) {
  const resolvedClientId = clientId ?? COACH_CLIENTS[0]?.id ?? "";
  return withLatency(COACH_DIET_PLAN_RECORDS[resolvedClientId] ?? []);
}

export async function getPersonalCoachTrainingPlans(clientId?: string) {
  const resolvedClientId = clientId ?? COACH_CLIENTS[0]?.id ?? "";
  return withLatency(COACH_TRAINING_PLAN_RECORDS[resolvedClientId] ?? []);
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
