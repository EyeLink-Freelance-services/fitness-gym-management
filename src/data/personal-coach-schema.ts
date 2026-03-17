import {
  SCHEMA_FIELD_GROUPS,
  SCHEMA_FORMULAS_BASE,
  SCHEMA_VALIDATION_RULES,
} from "@/data/schema-dummy-data";
import type { SchemaSummary } from "@/types/dashboard/coach-schema";
import { PersonalCoachSessionRow } from "@/types/dashboard/personal-coach";

export const statusClassNames: Record<
  PersonalCoachSessionRow["status"],
  string
> = {
  Done: "text-green",
  Now: "text-[#FFA70B]",
  Scheduled: "text-[#0ABEF9]",
};

const totalFields = SCHEMA_FIELD_GROUPS.reduce((sum, g) => sum + g.fields.length, 0);
const totalFormulas = 4;

export const PERSONAL_COACH_SCHEMA_SUMMARY: SchemaSummary = {
  id: "schema-coach-v2",
  ownerType: "personal_coach",
  ownerName: "Ava Wilson",
  schemaLabel: "Lean Recomp Protocol",
  activeVersion: "v2",
  totalGroups: SCHEMA_FIELD_GROUPS.length,
  totalFields,
  totalFormulas,
  linkedClients: 8,
  updatedAt: "2026-03-13T08:10:00.000Z",
  status: "active",
};

export const PERSONAL_COACH_FIELD_GROUPS = SCHEMA_FIELD_GROUPS;
export const PERSONAL_COACH_VALIDATION_RULES = SCHEMA_VALIDATION_RULES;
export const PERSONAL_COACH_FORMULAS = SCHEMA_FORMULAS_BASE;
