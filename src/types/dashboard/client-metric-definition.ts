import type { AuditableApiBean } from "./shared";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface ClientMetricDefinitionRequestApiBean {
  code: string;
  unit: string;
  group: string;
}

export interface ClientMetricDefinitionResponseApiBean {
  id: string;
  code: string;
  unit: string;
  group: string;
  auditData?: AuditableApiBean;
}

export interface SearchClientMetricDefinitionsApiBean {
  definitions?: ClientMetricDefinitionResponseApiBean[];
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface MetricDefinitionFormValues {
  label: string;
  unit: string;
  group: string;
}
