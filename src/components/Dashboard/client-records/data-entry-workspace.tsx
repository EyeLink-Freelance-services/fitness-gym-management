"use client";

import { ComputedResultsPanel } from "@/components/Dashboard/client-records/computed-results-panel";
import { DynamicFormGroup } from "@/components/Dashboard/client-records/dynamic-form-group";
import { Button } from "@/components/ui-elements/button";
import { evaluateFormulaCollection } from "@/lib/formula/preview-engine";
import type { ClientRecordDraft, ComputedMetric } from "@/types/dashboard/client-records";
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

  const computedMetrics = useMemo<ComputedMetric[]>(() => {
    try {
      const resolved = evaluateFormulaCollection(formulas, getNumericScope(values));

      return draft.computedMetrics.map((metric) => {
        const formula = formulas.find((item) => item.key === metric.key);

        if (!formula || resolved[metric.key] === undefined) {
          return metric;
        }

        return {
          ...metric,
          value: formatMetricValue(resolved[metric.key], formula.decimals),
          unit: formula.unit,
        };
      });
    } catch {
      return draft.computedMetrics;
    }
  }, [draft.computedMetrics, formulas, values]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
      <div className="grid gap-6">
        <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
                WL
              </span>
              <div>
                <h2 className="text-lg font-bold text-dark dark:text-white">
                  {draft.clientName}
                </h2>
                <p className="mt-0.5 text-xs text-dark-5">
                  Male 32y 172cm Premium Schema v3
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-[160px_130px_minmax(220px,1fr)]">
              <select className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white">
                <option>{draft.clientName}</option>
              </select>
              <input
                value={draft.sessionDate}
                onChange={() => undefined}
                className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
              />
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Session notes..."
                className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
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

        <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
          <Button
            label="Save Draft"
            variant="outlineDark"
            className="w-full"
            toastMessage="Draft storage will be connected in phase 2."
          />
          <Button
            label="Save & Compute"
            className="w-full"
            toastMessage="Preview mode is active for this UI-first release."
          />
        </div>
      </div>

      <div className="xl:sticky xl:top-20 xl:self-start">
        <ComputedResultsPanel
          metrics={computedMetrics}
          previousMetrics={draft.previousMetrics}
          snapshots={draft.formulaSnapshots}
        />
      </div>
    </div>
  );
}
