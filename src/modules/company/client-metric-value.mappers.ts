import { buildClientRecordDraft } from "@/modules/client-records/client-record-draft.mappers";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type {
  ClientMetricValueApiBean,
  ClientMetricValueDraft,
  ClientMetricValueFieldMeta,
  ClientMetricValueRequestBody,
  SearchClientMetricValueResponseBody,
} from "@/types/dashboard/client-metric-value";

function normalizeValue(value: string | null | undefined): string {
  return value ?? "";
}

function hasMetricIdentity(item: ClientMetricValueApiBean): boolean {
  return Boolean(item.definitionId?.trim() || item.code?.trim());
}

function isNestedGroup(
  item: ClientMetricValueApiBean,
): item is ClientMetricValueApiBean & { fields: ClientMetricValueApiBean[] } {
  return Array.isArray(item.fields) && item.fields.length > 0;
}

function collectMetricValues(
  response: SearchClientMetricValueResponseBody,
): ClientMetricValueApiBean[] {
  const items: ClientMetricValueApiBean[] = [];

  const addItem = (item: ClientMetricValueApiBean) => {
    if (!hasMetricIdentity(item)) return;
    items.push(item);
  };

  for (const group of response.groups ?? []) {
    if (isNestedGroup(group)) {
      group.fields.forEach(addItem);
      continue;
    }

    addItem(group);
  }

  return items;
}

function indexMetricValues(response: SearchClientMetricValueResponseBody) {
  const byDefinitionId = new Map<string, ClientMetricValueApiBean>();
  const byCode = new Map<string, ClientMetricValueApiBean>();

  for (const item of collectMetricValues(response)) {
    const definitionId = item.definitionId?.trim();
    const code = item.code?.trim();

    if (definitionId) {
      byDefinitionId.set(definitionId, item);
    }
    if (code) {
      byCode.set(code, item);
    }
  }

  return { byDefinitionId, byCode };
}

export function mapMetricValuesToDraft(
  definitionGroups: FieldGroup[],
  response: SearchClientMetricValueResponseBody,
  clientId: string,
  clientName: string,
): ClientMetricValueDraft {
  const { byDefinitionId, byCode } = indexMetricValues(response);
  const values: Record<string, string> = {};
  const fieldMeta: Record<string, ClientMetricValueFieldMeta> = {};

  definitionGroups.forEach((group) => {
    group.fields.forEach((field) => {
      const metricValue =
        byDefinitionId.get(field.id) ?? byCode.get(field.key);

      values[field.key] = normalizeValue(metricValue?.value);
      fieldMeta[field.key] = {
        definitionId: field.id,
        valueId: metricValue?.id ?? null,
        groupName: group.name,
        unit: field.unit ?? metricValue?.unit ?? "",
      };
    });
  });

  return {
    ...buildClientRecordDraft({
      clientId,
      clientName,
      groups: definitionGroups,
      values,
    }),
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
