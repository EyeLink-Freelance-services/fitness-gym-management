import type { AuditableApiBean } from "./shared";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface MetricFormulaRequestApiBean {
  code: string;
  label?: string;
  unit: string;
  expression: string;
  description?: string;
  definitionIds: string[];
}

export interface MetricFormulaResponseApiBean {
  id: string;
  code?: string;
  label?: string;
  unit: string;
  expression: string;
  description?: string;
  definitionIds?: string[];
  auditData?: AuditableApiBean;
}

export interface SearchMetricFormulaResponseBody {
  formulas?: MetricFormulaResponseApiBean[];
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
}
