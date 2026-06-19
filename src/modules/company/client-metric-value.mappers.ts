import { buildClientRecordDraft } from "@/modules/client-records/client-record-draft.mappers";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";
import type {
  ClientMetricValueDraft,
  ClientMetricValueFieldMeta,
  ClientMetricValueRequestBody,
  SearchClientMetricValueResponseBody,
} from "@/types/dashboard/client-metric-value";

function groupIdFromName(name: string): string {
  return `group-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function normalizeValue(value: string | null | undefined): string {
  return value ?? "";
}

export function mapMetricValuesToDraft(
  response: SearchClientMetricValueResponseBody,
  clientId: string,
  clientName: string,
): ClientMetricValueDraft {
  const groups: FieldGroup[] = [];
  const values: Record<string, string> = {};
  const fieldMeta: Record<string, ClientMetricValueFieldMeta> = {};

  (response.groups ?? []).forEach((group, groupIndex) => {
    const groupName = group.groupName.trim() || "General";
    const groupId = groupIdFromName(groupName);
    const fields: SchemaField[] = [];

    group.fields.forEach((field, fieldIndex) => {
      values[field.code] = normalizeValue(field.value);
      fieldMeta[field.code] = {
        definitionId: field.definitionId,
        valueId: field.id,
        groupName,
        unit: field.unit,
      };

      fields.push({
        id: field.definitionId,
        groupId,
        label: field.code,
        key: field.code,
        type: "number",
        unit: field.unit,
        required: true,
        sortOrder: fieldIndex * 10 + 10,
      });
    });

    groups.push({
      id: groupId,
      name: groupName,
      sortOrder: groupIndex * 10 + 10,
      fields,
    });
  });

  return {
    ...buildClientRecordDraft({ clientId, clientName, groups, values }),
    fieldMeta,
  };
}

export function mapChangedValuesToRequest(
  currentValues: Record<string, string>,
  originalValues: Record<string, string>,
  fieldMeta: Record<string, ClientMetricValueFieldMeta>,
): ClientMetricValueRequestBody {
  const values = Object.entries(fieldMeta).flatMap(([code, meta]) => {
    const current = normalizeValue(currentValues[code]);
    const original = normalizeValue(originalValues[code]);

    if (current === original) {
      return [];
    }

    return [
      {
        definitionId: meta.definitionId,
        id: meta.valueId,
        value: current || null,
      },
    ];
  });

  return { values };
}
