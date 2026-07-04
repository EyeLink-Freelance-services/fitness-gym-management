"use client";

import { useSyncedState } from "@/hooks/use-synced-state";
import { useMemo, useState } from "react";
import { ComputedResultsPanel } from "@/components/Dashboard/client-records/computed-results-panel";
import { DynamicFormGroup } from "@/components/Dashboard/client-records/dynamic-form-group";
import { Button } from "@/components/ui-elements/button";
import { evaluateFormulaCollectionSafe } from "@/lib/formula/preview-engine";
import type { ClientRecordDraft, ComputedMetric, FormulaSnapshotPreview} from "@/types/dashboard/client-records";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { initials } from "@/utils/dashboard/shared";

type DataEntrySaveInput = {
  values: Record<string, string>;
};

type DataEntryWorkspaceProps = {
  draft: ClientRecordDraft;
  formulas: FormulaDefinition[];
  onSave?: (input: DataEntrySaveInput) => Promise<void>;
};

function getNumericScope(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([, value]) => value.trim() !== "")
      .map(([key, value]) => [key, Number(value)])
      .filter(([, value]) => !Number.isNaN(value)),
  );
}

export function DataEntryWorkspace({
  draft,
  formulas,
  onSave,
}: DataEntryWorkspaceProps) {
  const [values, setValues] = useSyncedState(draft.values);
  const [isSaving, setIsSaving] = useState(false);

  const clientInitials = initials(draft.clientName);

  const { computedMetrics, formulaSnapshots } = useMemo(() => {
    const numericScope = getNumericScope(values);
    const resolved = evaluateFormulaCollectionSafe(formulas, numericScope);
    const metrics: ComputedMetric[] = formulas.map((formula) => ({
      id: `metric-${formula.key}`,
      label: formula.label,
      key: formula.key,
      value:
        resolved[formula.key] !== undefined
          ? resolved[formula.key]!.toLocaleString("en-US")
          : "-",
      unit: formula.unit,
    }));
    const snapshots: FormulaSnapshotPreview[] = formulas.map((formula) => ({
      id: `snapshot-${formula.key}`,
      label: formula.label,
      expression: formula.expression,
      result:
        resolved[formula.key] !== undefined
          ? `${resolved[formula.key]!.toLocaleString("en-US")} ${formula.unit ?? ""}`.trim()
          : "-",
    }));
    return { computedMetrics: metrics, formulaSnapshots: snapshots };
  }, [formulas, values]);

  const handleSave = async () => {
    if (!onSave) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ values });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
      <div className="grid gap-6">
        <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
              {clientInitials}
            </span>
            <h2 className="text-lg font-bold text-dark dark:text-white">
              {draft.clientName}
            </h2>
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
          label={isSaving ? "Saving…" : "Save"}
          variant="outlineDark"
          size="small"
          onClick={handleSave}
          disabled={isSaving}
          toastMessage={
            onSave ? undefined : "Draft storage will be connected in phase 2."
          }
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
