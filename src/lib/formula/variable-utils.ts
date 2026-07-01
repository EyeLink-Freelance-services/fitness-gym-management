import type {
  FormulaDefinition,
  FormulaVariableReference,
} from "@/types/dashboard/formula-builder";
import type { SchemaField } from "@/types/dashboard/coach-schema";

const IDENTIFIER_PATTERN = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;

export const EXPRESSION_FUNCTIONS = [
  "abs",
  "sqrt",
  "pow",
  "log",
  "log10",
  "exp",
  "round",
  "floor",
  "ceil",
  "min",
  "max",
  "sin",
  "cos",
  "tan",
] as const;

export const EXPRESSION_OPERATORS = ["+", "-", "*", "/", "^"] as const;

export const EXPRESSION_PICKER_OPERATORS = [
  ...EXPRESSION_OPERATORS,
  "(",
  ")",
] as const;

export function appendExpressionToken(expression: string, token: string): string {
  const trimmed = expression.trimEnd();
  return trimmed ? `${trimmed} ${token}` : token;
}

const BUILT_IN_FUNCTIONS = new Set<string>([
  ...EXPRESSION_FUNCTIONS,
  "pi",
  "e",
]);

const RESERVED_WORDS = new Set(["true", "false", "null", "undefined"]);

export function extractExpressionVariables(expression: string): string[] {
  const matches = expression.match(IDENTIFIER_PATTERN) ?? [];

  return Array.from(
    new Set(
      matches.filter(
        (token) =>
          !BUILT_IN_FUNCTIONS.has(token) && !RESERVED_WORDS.has(token),
      ),
    ),
  );
}

export function getAutocompleteItems(
  expression: string,
  cursor: number,
  knownVariables: string[],
): string[] {
  const beforeCursor = expression.slice(0, cursor);
  const currentWord =
    beforeCursor.match(/[a-zA-Z_][a-zA-Z0-9_]*$/)?.[0] ?? "";

  if (!currentWord) {
    return [];
  }

  return knownVariables.filter(
    (item) => item.startsWith(currentWord) && item !== currentWord,
  );
}

export function buildVariableReferences(
  fields: SchemaField[],
  formulas: FormulaDefinition[],
): FormulaVariableReference[] {
  const fieldRefs: FormulaVariableReference[] = fields.map((field) => ({
    key: field.key,
    label: field.label,
    source: "field",
  }));

  const formulaRefs: FormulaVariableReference[] = formulas.map((formula) => ({
    key: formula.key,
    label: formula.label,
    source: "formula",
  }));

  return [
    ...fieldRefs,
    ...formulaRefs,
    { key: "pi", label: "pi", source: "constant" },
    { key: "e", label: "e", source: "constant" },
  ];
}

export function getValidExpressionParameters(
  variableReferences: FormulaVariableReference[],
) {
  return {
    schemaFields: variableReferences.filter((ref) => ref.source === "field"),
    formulas: variableReferences.filter((ref) => ref.source === "formula"),
    constants: variableReferences.filter((ref) => ref.source === "constant"),
    variableKeys: variableReferences.map((ref) => ref.key),
    functions: [...EXPRESSION_FUNCTIONS],
    operators: [...EXPRESSION_OPERATORS],
  };
}

export function getFormulaDependencies(
  formulas: Pick<FormulaDefinition, "key" | "expression">[],
): Map<string, string[]> {
  const formulaKeys = new Set(formulas.map((formula) => formula.key));

  return new Map(
    formulas.map((formula) => [
      formula.key,
      extractExpressionVariables(formula.expression).filter((token) =>
        formulaKeys.has(token),
      ),
    ]),
  );
}
