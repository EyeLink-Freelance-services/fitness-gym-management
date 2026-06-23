import type { ClientRecordDraft } from "./client-records";

export interface ClientMetricValueApiBean {
  id?: string;
  definitionId?: string;
  code?: string;
  unit?: string;
  value?: string;
  groupName?: string;
  fields?: ClientMetricValueApiBean[];
}

export interface SearchClientMetricValueResponseBody {
  groups?: ClientMetricValueApiBean[];
}

export interface ClientMetricValueRequestApiBean {
  definitionId: string;
  id?: string | null;
  value: string | null;
}

export interface ClientMetricValueRequestBody {
  values: ClientMetricValueRequestApiBean[];
}

export interface ClientMetricValueFieldMeta {
  definitionId: string;
  valueId: string | null;
  groupName: string;
  unit: string;
}

export interface ClientMetricValueDraft extends ClientRecordDraft {
  fieldMeta: Record<string, ClientMetricValueFieldMeta>;
}

export type SaveClientMetricValuesInput = {
  values: Record<string, string>;
  originalValues: Record<string, string>;
  fieldMeta: Record<string, ClientMetricValueFieldMeta>;
};

export type CompanyClientMetricValueDraftResult = {
  draft: ClientMetricValueDraft;
  metricValues: SearchClientMetricValueResponseBody;
};
