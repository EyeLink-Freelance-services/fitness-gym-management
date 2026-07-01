import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type {
  ClientMetricDefinitionRequestApiBean,
  ClientMetricDefinitionResponseApiBean,
  MetricDefinitionFormValues,
} from "@/types/dashboard/client-metric-definition";

function groupIdFromName(name: string): string {
  return `group-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function mapFormToMetricDefinitionRequest(
  values: MetricDefinitionFormValues,
): ClientMetricDefinitionRequestApiBean {
  return {
    code: values.label.trim(),
    unit: values.unit.trim(),
    group: values.group.trim(),
  };
}

export function mapMetricDefinitionsToFieldGroups(
  definitions: ClientMetricDefinitionResponseApiBean[],
): FieldGroup[] {
  const groupMap = new Map<string, FieldGroup>();

  definitions.forEach((definition, index) => {
    const groupName = definition.group.trim() || "General";
    const groupId = groupIdFromName(groupName);

    let group = groupMap.get(groupName);
    if (!group) {
      group = {
        id: groupId,
        name: groupName,
        sortOrder: groupMap.size * 10 + 10,
        fields: [],
      };
      groupMap.set(groupName, group);
    }

    group.fields.push({
      id: definition.id,
      groupId: group.id,
      label: definition.code,
      key: definition.code,
      type: "number",
      unit: definition.unit,
      required: true,
      sortOrder: index * 10 + 10,
    });
  });

  return Array.from(groupMap.values());
}

export function getMetricDefinitionSaveErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to save field.";
  }

  if (
    error.message.includes("409") ||
    error.message.includes("DUPLICATE_ENTRY")
  ) {
    return "A field with this label already exists.";
  }

  return (
    error.message.replace(/^Backend API error \d+: /, "") ||
    "Unable to save field."
  );
}
