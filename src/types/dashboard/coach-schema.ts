export type SchemaOwnerType = "company" | "personal_coach";

export type FieldType = "number" | "text" | "boolean" | "dropdown" | "date";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
  helperText?: string;
}

export interface SchemaField {
  id: string;
  groupId: string;
  label: string;
  key: string;
  type: FieldType;
  unit?: string;
  placeholder?: string;
  description?: string;
  options?: FieldOption[];
  required: boolean;
  readOnly?: boolean;
  showPortal?: boolean;
  archived?: boolean;
  sortOrder: number;
  validation?: FieldValidationRule;
}

export interface FieldGroup {
  id: string;
  name: string;
  description?: string;
  accentColor?: string;
  iconKey?: string;
  unitHint?: string;
  sortOrder: number;
  fields: SchemaField[];
}

export interface SchemaVersionSummary {
  id: string;
  version: string;
  note: string;
  changedAt: string;
  changedBy: string;
  fieldCount: number;
  formulaCount: number;
  linkedClients: number;
  isActive: boolean;
}

export interface SchemaSummary {
  id: string;
  ownerType: SchemaOwnerType;
  ownerName: string;
  schemaLabel: string;
  activeVersion: string;
  totalGroups: number;
  totalFields: number;
  totalFormulas: number;
  linkedClients: number;
  updatedAt: string;
  status: "active" | "draft";
}

export interface SchemaValidationRuleSummary {
  id: string;
  title: string;
  description: string;
  value: string;
}
