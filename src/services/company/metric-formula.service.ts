import {
  backendDelete,
  backendGet,
  backendPost,
  backendPut,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import {
  mapFormulaToRequest,
  mapMetricFormulasToDefinitions,
} from "@/modules/company/metric-formula.mappers";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import type { SchemaField } from "@/types/dashboard/coach-schema";
import type { SearchMetricFormulaResponseBody } from "@/types/dashboard/metric-formula";

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

function metricFormulaBase(companyId: string) {
  return `${COMPANY_API_BASE}/${companyId}/metric-formulas`;
}

export async function getMetricFormulas(): Promise<FormulaDefinition[]> {
  const companyId = await requireCompanyId();

  const data = await backendGet<SearchMetricFormulaResponseBody>(
    `${metricFormulaBase(companyId)}?pageNumber=0&pageSize=200`,
  );

  return mapMetricFormulasToDefinitions(data.formulas ?? []);
}

export async function createMetricFormula(
  formula: FormulaDefinition,
  existingFormulas: FormulaDefinition[],
  fields: SchemaField[],
) {
  const companyId = await requireCompanyId();
  const existingKeys = new Set(existingFormulas.map((item) => item.key));

  return backendPost(
    metricFormulaBase(companyId),
    mapFormulaToRequest(formula, existingKeys, fields),
  );
}

export async function updateMetricFormula(
  metricFormulaId: string,
  formula: FormulaDefinition,
  fields: SchemaField[],
) {
  const companyId = await requireCompanyId();

  return backendPut(
    `${metricFormulaBase(companyId)}/${metricFormulaId}`,
    mapFormulaToRequest(formula, new Set(), fields, formula.key || undefined),
  );
}

export async function deleteMetricFormula(metricFormulaId: string) {
  const companyId = await requireCompanyId();

  return backendDelete(
    `${metricFormulaBase(companyId)}/${metricFormulaId}`,
  );
}
