import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type { ClientRecordDraft } from "@/types/dashboard/client-records";

type BuildClientRecordDraftInput = {
  clientId: string;
  clientName: string;
  groups: FieldGroup[];
  values?: Record<string, string>;
  notes?: string;
  sessionDate?: string;
};

export function createEmptyFieldValues(
  groups: FieldGroup[],
): Record<string, string> {
  return Object.fromEntries(
    groups.flatMap((group) =>
      group.fields.map((field) => [field.key, ""]),
    ),
  );
}

export function buildClientRecordDraft({
  clientId,
  clientName,
  groups,
  values,
  notes = "",
  sessionDate = new Date().toISOString().split("T")[0],
}: BuildClientRecordDraftInput): ClientRecordDraft {
  return {
    clientId,
    clientName,
    sessionDate,
    notes,
    groups,
    values: values ?? createEmptyFieldValues(groups),
    computedMetrics: [],
    previousMetrics: [],
    formulaSnapshots: [],
  };
}

export function calculateAgeFromDateOfBirth(dateOfBirth: string): string | undefined {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return undefined;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : undefined;
}

export type ClientProfileSeed = {
  dateOfBirth?: string;
};

export function seedFieldValuesFromProfile(
  groups: FieldGroup[],
  profile?: ClientProfileSeed,
): Record<string, string> {
  const values = createEmptyFieldValues(groups);
  const age = profile?.dateOfBirth
    ? calculateAgeFromDateOfBirth(profile.dateOfBirth)
    : undefined;

  if (age !== undefined && Object.hasOwn(values, "age")) {
    values.age = age;
  }

  return values;
}
