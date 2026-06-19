import type { ClientRecordDraft } from "./client-records";

export interface ClientMetricValueFieldApiBean {
  code: string;
  definitionId: string;
  id: string | null;
  unit: string;
  value: string | null;
}

export interface ClientMetricValueGroupApiBean {
  groupName: string;
  fields: ClientMetricValueFieldApiBean[];
}

export interface SearchClientMetricValueResponseBody {
  groups?: ClientMetricValueGroupApiBean[];
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
