import { SchemaMode } from "@/lib/db/helpers/resolve-schema-mode";
import { FieldGroup } from "./coach-schema";

export type FormulaVariableSource = "field" | "formula" | "constant";

export interface FullFormulas {
  mode: SchemaMode,
  groups: FieldGroup[],
  formulas: FormulaDefinition[]
}

export interface FormulaVariableReference {
  key: string;
  label: string;
  source: FormulaVariableSource;
}

export interface FormulaDefinition {
  id: string;
  isNew?: boolean;
  label: string;
  key: string;
  unit?: string;
  decimals: number;
  expression: string;
  description?: string;
  showPortal: boolean;
}

export interface FormulaDependencyNode {
  key: string;
  label: string;
  depth: number;
  dependsOn: string[];
  source: FormulaVariableSource;
}

export interface FormulaTestInput {
  key: string;
  label: string;
  source: FormulaVariableSource;
  value: number | string;
  unit?: string;
}

export interface FormulaValidationResult {
  valid: boolean;
  detectedVariables: string[];
  unknownVariables: string[];
  circularDependencies: string[];
  error?: string;
  previewResult?: number;
}
