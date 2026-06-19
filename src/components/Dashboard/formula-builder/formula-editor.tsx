"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui-elements/button";
import type {
  FormulaDefinition,
  FormulaValidationResult,
} from "@/types/dashboard/formula-builder";

type FormulaEditorProps = {
  formula: FormulaDefinition;
  isNew: boolean;
  onFormulaChange: (patch: Partial<FormulaDefinition>) => void;
  onSave: () => void;
  validation: FormulaValidationResult;
};

export function FormulaEditor({
  formula,
  isNew,
  onFormulaChange,
  onSave,
  validation,
}: FormulaEditorProps) {
  const title =
    isNew && !formula.label.trim()
      ? "New formula"
      : formula.label.trim() || "Untitled";

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            {formula.key.trim() ? (
              <>
                Key: `{formula.key}` {formula.unit ? `· Unit ${formula.unit}` : ""}
              </>
            ) : (
              <>
                {formula.unit ? `Unit ${formula.unit}` : ""}
                {formula.unit ? " · " : ""}
                The variable key is assigned when you save.
              </>
            )}
          </p>
          {formula.description?.trim() ? (
            <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
              {formula.description}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button label="Delete" size="small" variant="danger" />
          )}
        </div>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Label
            </span>
            <input
              value={formula.label}
              onChange={(e) => onFormulaChange({ label: e.target.value })}
              placeholder="Display name"
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Unit
            </span>
            <input
              value={formula.unit ?? ""}
              onChange={(e) => onFormulaChange({ unit: e.target.value })}
              placeholder="e.g. kg"
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
            Expression
          </label>
          <textarea
            value={formula.expression}
            onChange={(e) => onFormulaChange({ expression: e.target.value })}
            rows={6}
            className="w-full rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 font-medium",
                validation.valid
                  ? "bg-green/10 text-green"
                  : "bg-red/10 text-red",
              )}
            >
              {validation.valid
                ? "Expression valid"
                : (validation.error ?? "Needs attention")}
            </span>
            {validation.detectedVariables.map((variable) => (
              <span
                key={variable}
                className={cn(
                  "rounded-full px-2.5 py-1",
                  validation.unknownVariables.includes(variable)
                    ? "bg-red/10 text-red"
                    : "bg-primary/10 text-primary",
                )}
              >
                {variable}{" "}
                {validation.unknownVariables.includes(variable) ? "" : "✓"}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
            Description
          </label>
          <input
            value={formula.description ?? ""}
            onChange={(e) => onFormulaChange({ description: e.target.value })}
            placeholder="Optional help text"
            className="w-full rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
          />
        </div>

        <Button label="Save Formula" className="w-full" onClick={onSave} />
      </div>
    </div>
  );
}
