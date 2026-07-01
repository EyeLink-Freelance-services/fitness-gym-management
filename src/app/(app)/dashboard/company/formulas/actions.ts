"use server";

import { getMetricFormulaSaveErrorMessage } from "@/modules/company/metric-formula.mappers";
import {
  createMetricFormula,
  deleteMetricFormula,
  updateMetricFormula,
} from "@/services/company/metric-formula.service";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import type { SchemaField } from "@/types/dashboard/coach-schema";
import type { ActionResult } from "@/types/dashboard/metric-formula";
import { revalidatePath } from "next/cache";

const FORMULAS_PATH = "/dashboard/company/formulas";

async function runFormulaAction(
  action: () => Promise<unknown>,
): Promise<ActionResult> {
  try {
    await action();
    revalidatePath(FORMULAS_PATH);
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: getMetricFormulaSaveErrorMessage(error) };
  }
}

export async function createMetricFormulaAction(
  formula: FormulaDefinition,
  existingFormulas: FormulaDefinition[],
  fields: SchemaField[],
): Promise<ActionResult> {
  return runFormulaAction(() =>
    createMetricFormula(formula, existingFormulas, fields),
  );
}

export async function updateMetricFormulaAction(
  metricFormulaId: string,
  formula: FormulaDefinition,
  fields: SchemaField[],
): Promise<ActionResult> {
  return runFormulaAction(() =>
    updateMetricFormula(metricFormulaId, formula, fields),
  );
}

export async function deleteMetricFormulaAction(
  metricFormulaId: string,
): Promise<ActionResult> {
  return runFormulaAction(() => deleteMetricFormula(metricFormulaId));
}
