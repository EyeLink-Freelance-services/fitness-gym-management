import type { SchemaOwnerType } from "@/types/dashboard/coach-schema";

export type FormulaVariableSource = "field" | "formula" | "constant";

export interface FormulaVariableReference {
  key: string;
  label: string;
  source: FormulaVariableSource;
}

export interface FormulaDefinition {
  id: string;
  ownerType: SchemaOwnerType;
  label: string;
  key: string;
  unit?: string;
  decimals: number;
  expression: string;
  description?: string;
  showPortal: boolean;
  sortOrder: number;
  activeVersion: string;
  recordCount: number;
  dependencies: string[];
  detectedVariables: FormulaVariableReference[];
}

export interface FormulaVersionSummary {
  id: string;
  formulaId: string;
  version: string;
  expression: string;
  note: string;
  recordCount: number;
  createdAt: string;
  changedBy: string;
  isActive: boolean;
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
