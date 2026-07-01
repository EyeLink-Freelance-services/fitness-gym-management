"use server";

import { getMetricDefinitionSaveErrorMessage } from "@/modules/company/client-metric-definition.mappers";
import {
  createClientMetricDefinition,
  deleteClientMetricDefinition,
  updateClientMetricDefinition,
} from "@/services/company/client-metric-definition.service";
import type {
  ActionResult,
  MetricDefinitionFormValues,
} from "@/types/dashboard/client-metric-definition";
import { revalidatePath } from "next/cache";

const SCHEMA_PATH = "/dashboard/company/schema";

async function runSchemaAction(
  action: () => Promise<unknown>,
): Promise<ActionResult> {
  try {
    await action();
    revalidatePath(SCHEMA_PATH);
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: getMetricDefinitionSaveErrorMessage(error) };
  }
}

export async function createMetricDefinitionAction(
  values: MetricDefinitionFormValues,
): Promise<ActionResult> {
  return runSchemaAction(() => createClientMetricDefinition(values));
}

export async function updateMetricDefinitionAction(
  clientMetricDefinitionId: string,
  values: MetricDefinitionFormValues,
): Promise<ActionResult> {
  return runSchemaAction(() =>
    updateClientMetricDefinition(clientMetricDefinitionId, values),
  );
}

export async function deleteMetricDefinitionAction(
  clientMetricDefinitionId: string,
): Promise<ActionResult> {
  return runSchemaAction(() =>
    deleteClientMetricDefinition(clientMetricDefinitionId),
  );
}
