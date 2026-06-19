import {
  SCHEMA_FIELD_GROUPS,
  SCHEMA_FORMULAS_BASE,
} from "@/data/schema-dummy-data";
import type { SchemaSummary } from "@/types/dashboard/coach-schema";

const totalFields = SCHEMA_FIELD_GROUPS.reduce(
  (sum, g) => sum + g.fields.length,
  0,
);
const totalFormulas = 4;

export const COMPANY_SCHEMA_SUMMARY: SchemaSummary = {
  id: "schema-company-v2",
  ownerType: "company",
  ownerName: "Prime Strength Company",
  schemaLabel: "Company Performance Schema",
  activeVersion: "v2",
  totalGroups: SCHEMA_FIELD_GROUPS.length,
  totalFields,
  totalFormulas,
  linkedClients: 18,
  updatedAt: "2026-03-11T12:30:00.000Z",
  status: "active",
};

export const COMPANY_FIELD_GROUPS = SCHEMA_FIELD_GROUPS;
export const COMPANY_FORMULAS = SCHEMA_FORMULAS_BASE;
