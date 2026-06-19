export type FormulaVariableSource = "field" | "formula" | "constant";

export interface FormulaVariableReference {
  key: string;
  label: string;
  source: FormulaVariableSource;
}

export interface FormulaDefinition {
  id: string;
  label: string;
  key: string;
  unit?: string;
  expression: string;
  description?: string;
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
