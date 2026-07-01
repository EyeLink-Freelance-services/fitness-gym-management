import {
  ensureUniqueFieldKey,
  generateFieldKeyFromLabel,
} from "@/lib/validation/helpers/schema-field-key";
import { extractExpressionVariables } from "@/lib/formula/variable-utils";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import type { SchemaField } from "@/types/dashboard/coach-schema";
import type {
  MetricFormulaRequestApiBean,
  MetricFormulaResponseApiBean,
} from "@/types/dashboard/metric-formula";

export function resolveDefinitionIds(
  expression: string,
  fields: SchemaField[],
): string[] {
  const fieldByKey = new Map(fields.map((field) => [field.key, field.id]));

  return Array.from(
    new Set(
      extractExpressionVariables(expression)
        .map((key) => fieldByKey.get(key))
        .filter((id): id is string => Boolean(id)),
    ),
  );
}

export function mapFormulaToRequest(
  formula: FormulaDefinition,
  existingKeys: Set<string>,
  fields: SchemaField[],
  existingKey?: string,
): MetricFormulaRequestApiBean {
  const label = formula.label?.trim() ?? "";
  const baseKey = existingKey?.trim() || generateFieldKeyFromLabel(label);
  const keysForUniqueness = new Set(existingKeys);
  if (existingKey) {
    keysForUniqueness.delete(existingKey);
  }
  const code = ensureUniqueFieldKey(baseKey, keysForUniqueness);

  return {
    code,
    label,
    unit: formula.unit?.trim() ?? "",
    expression: formula.expression?.trim() ?? "",
    description: formula.description?.trim() || undefined,
    definitionIds: resolveDefinitionIds(formula.expression ?? "", fields),
  };
}

export function mapMetricFormulasToDefinitions(
  formulas: MetricFormulaResponseApiBean[],
): FormulaDefinition[] {
  return formulas.map((formula) => {
    const label = formula.label?.trim() || formula.code?.trim() || "";
    const key =
      formula.code?.trim() ||
      (label ? generateFieldKeyFromLabel(label) : "");

    return {
      id: formula.id,
      label,
      key,
      unit: formula.unit || undefined,
      expression: formula.expression ?? "",
      description: formula.description,
      definitionIds: formula.definitionIds ?? [],
    };
  });
}

export function getMetricFormulaSaveErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Unable to save formula.";
  }

  if (
    error.message.includes("409") ||
    error.message.includes("DUPLICATE_ENTRY")
  ) {
    return "A formula with this key already exists.";
  }

  return (
    error.message.replace(/^Backend API error \d+: /, "") ||
    "Unable to save formula."
  );
}
