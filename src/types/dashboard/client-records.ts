import type { FieldGroup } from "@/types/dashboard/coach-schema";

export interface ClientListRow {
  id: string;
  name: string;
  phone: string;
  goal: string;
  status: "Active" | "Due Entry" | "Onboarding";
  schemaVersion: string;
  lastEntryAt: string;
  upcomingCheckIn: string;
  age?: number;
  height?: number;
  plan?: string;
  weight?: number;
  bodyFat?: number;
  leanMass?: number;
  bmi?: number;
  progressNote?: string;
  daysSinceEntry?: number;
}

export type ClientCardsGridProps = {
  clients: ClientListRow[];
};

export interface ComputedMetric {
  id: string;
  label: string;
  key: string;
  value: string;
  unit?: string;
  delta?: number;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
}

export interface FormulaSnapshotPreview {
  id: string;
  label: string;
  expression: string;
  result: string;
}

export interface ClientRecordRow {
  id: string;
  sessionDate: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  fatMass: number;
  leanMass: number;
  bmr: number;
  tdee: number;
  fatDelta: number;
}

export interface ProgressPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface ProgressSeries {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  chartType?: "line" | "stacked";
  unit?: string;
  points: ProgressPoint[];
}

export interface ClientRecordDraft {
  clientId: string;
  clientName: string;
  sessionDate: string;
  notes: string;
  groups: FieldGroup[];
  values: Record<string, string>;
  computedMetrics: ComputedMetric[];
  previousMetrics: ComputedMetric[];
  formulaSnapshots: FormulaSnapshotPreview[];
}
