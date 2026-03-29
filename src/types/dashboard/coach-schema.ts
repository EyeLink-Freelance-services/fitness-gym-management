import { SchemaMode } from "@/lib/db/helpers/resolve-schema-mode";

export type SchemaOwnerType = "company" | "personal";

export type FieldType = "number" | "text" | "dropdown";

export interface FullSchema {
  mode: SchemaMode;
  summary: SchemaSummary;
  groups: FieldGroup[];
  rules: SchemaValidationRuleSummary[];
}
export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidationRule extends Record<string, unknown> {
  min?: number;
  max?: number;
  pattern?: string;
  helperText?: string;
}

export interface SchemaField {
  id: string;
  isNew?: boolean;
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
  isNew?: boolean;
  name: string;
  description?: string;
  accentColor?: string;
  iconKey?: string;
  unitHint?: string;
  sortOrder: number;
  fields: SchemaField[];
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
