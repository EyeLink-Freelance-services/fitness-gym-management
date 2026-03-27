"use client";

import { ComputedResultsPanel } from "@/components/Dashboard/client-records/computed-results-panel";
import { DynamicFormGroup } from "@/components/Dashboard/client-records/dynamic-form-group";
import { Button } from "@/components/ui-elements/button";
import { evaluateFormulaCollection } from "@/lib/formula/preview-engine";
import type {
  ClientRecordDraft,
  ComputedMetric,
  FormulaSnapshotPreview,
} from "@/types/dashboard/client-records";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { useMemo, useState } from "react";

type DataEntryWorkspaceProps = {
  draft: ClientRecordDraft;
  formulas: FormulaDefinition[];
};

function formatMetricValue(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function getNumericScope(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, Number(value)])
      .filter(([, value]) => !Number.isNaN(value)),
  );
}

export function DataEntryWorkspace({
  draft,
  formulas,
}: DataEntryWorkspaceProps) {
  const [values, setValues] = useState<Record<string, string>>(draft.values);
  const [notes, setNotes] = useState(draft.notes);

  const { computedMetrics, formulaSnapshots } = useMemo(() => {
    const numericScope = getNumericScope(values);
    let resolved: Record<string, number> = {};
    try {
      resolved = evaluateFormulaCollection(formulas, numericScope);
    } catch {
      // keep empty
    }
    const metrics: ComputedMetric[] = formulas.map((formula) => ({
      id: `metric-${formula.key}`,
      label: formula.label,
      key: formula.key,
      value:
        resolved[formula.key] !== undefined
          ? formatMetricValue(resolved[formula.key], formula.decimals)
          : "-",
      unit: formula.unit,
    }));
    const snapshots: FormulaSnapshotPreview[] = formulas.map((formula) => ({
      id: `snapshot-${formula.key}`,
      label: formula.label,
      expression: formula.expression,
      result:
        resolved[formula.key] !== undefined
          ? `${formatMetricValue(resolved[formula.key], formula.decimals)} ${formula.unit ?? ""}`.trim()
          : "-",
    }));
    return { computedMetrics: metrics, formulaSnapshots: snapshots };
  }, [formulas, values]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
      <div className="grid gap-6">
        <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
                WL
              </span>
              <h2 className="text-lg font-bold text-dark dark:text-white">
                {draft.clientName}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="min-w-[120px] rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-center text-sm text-dark dark:border-dark-3 dark:text-white">
                {new Date().toISOString().split("T")[0]}
              </p>

              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Session notes..."
                className="w-full rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
              />
            </div>
          </div>
        </section>

        {draft.groups.map((group) => (
          <DynamicFormGroup
            key={group.id}
            group={group}
            values={values}
            onChange={(key, value) =>
              setValues((current) => ({
                ...current,
                [key]: value,
              }))
            }
          />
        ))}

        <Button
          label="Save"
          variant="outlineDark"
          size="small"
          toastMessage="Draft storage will be connected in phase 2."
        />
      </div>

      <div className="xl:sticky xl:top-20 xl:self-start">
        <ComputedResultsPanel
          metrics={computedMetrics}
          previousMetrics={draft.previousMetrics}
          snapshots={formulaSnapshots}
        />
      </div>
    </div>
  );
}
