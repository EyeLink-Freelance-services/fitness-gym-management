import {
  COMPANY_FIELD_GROUPS,
  COMPANY_FORMULA_VERSIONS,
  COMPANY_FORMULAS,
  COMPANY_SCHEMA_SUMMARY,
  COMPANY_SCHEMA_VALIDATION_RULES,
  COMPANY_SCHEMA_VERSIONS,
} from "@/data/company-schema";
import { COACH_CLIENTS } from "@/data/coach-clients";
import {
  COACH_PROGRESS_RECORDS,
  COACH_PROGRESS_SERIES,
  COACH_PROGRESS_SUMMARY,
  COACH_RECORD_DRAFTS,
} from "@/data/coach-progress";
import {
  PERSONAL_COACH_FIELD_GROUPS,
  PERSONAL_COACH_FORMULA_VERSIONS,
  PERSONAL_COACH_FORMULAS,
  PERSONAL_COACH_SCHEMA_SUMMARY,
  PERSONAL_COACH_SCHEMA_VERSIONS,
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

export async function getCompanySchemaVersions() {
  return withLatency(COMPANY_SCHEMA_VERSIONS);
}

export async function getCompanyFormulas() {
  return withLatency(COMPANY_FORMULAS);
}

export async function getCompanyFormulaVersions() {
  return withLatency(COMPANY_FORMULA_VERSIONS);
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

export async function getPersonalCoachSchemaVersions() {
  return withLatency(PERSONAL_COACH_SCHEMA_VERSIONS);
}

export async function getPersonalCoachFormulas() {
  return withLatency(PERSONAL_COACH_FORMULAS);
}

export async function getPersonalCoachFormulaVersions() {
  return withLatency(PERSONAL_COACH_FORMULA_VERSIONS);
}

export async function getPersonalCoachClients() {
  return withLatency(COACH_CLIENTS);
}

export async function getPersonalCoachRecordDraft(
  clientId = "client-wei-liang",
) {
  return withLatency(COACH_RECORD_DRAFTS[clientId] ?? COACH_RECORD_DRAFTS["client-wei-liang"]);
}

export async function getPersonalCoachProgressOverview() {
  return withLatency({
    summaryCards: COACH_PROGRESS_SUMMARY,
    series: COACH_PROGRESS_SERIES,
    records: COACH_PROGRESS_RECORDS,
  });
}
