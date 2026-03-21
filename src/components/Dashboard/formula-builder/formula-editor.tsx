"use client";

import { cn } from "@/lib/utils";
import CustomSelect from "@/components/ui/custom-select";
import { Button } from "@/components/ui-elements/button";
import type {
  FormulaDefinition,
  FormulaValidationResult,
} from "@/types/dashboard/formula-builder";

type FormulaEditorProps = {
  formula: FormulaDefinition;
  expression: string;
  onExpressionChange: (expression: string) => void;
  validation: FormulaValidationResult;
};

export function FormulaEditor({
  formula,
  expression,
  onExpressionChange,
  validation,
}: FormulaEditorProps) {
  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
              {formula.label}
            </h3>
          </div>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            Key: `{formula.key}` {formula.unit ? `· Unit ${formula.unit}` : ""}
          </p>
          {formula.description && (
            <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
              {formula.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button label="Delete" size="small" variant="danger" />
        </div>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Label
            </span>
            <input
              value={formula.label}
              readOnly
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Unit
            </span>
            <input
              value={formula.unit ?? ""}
              readOnly
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Decimals
            </span>
            <input
              value={String(formula.decimals)}
              readOnly
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
              Show
            </span>
            <CustomSelect
              options={[
                { label: "No", value: "no" },
                { label: "Yes", value: "yes" },
              ]}
              defaultValue={formula.showPortal ? "yes" : "no"}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
            Expression
          </label>
          <textarea
            value={expression}
            onChange={(event) => onExpressionChange(event.target.value)}
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
            readOnly
            className="w-full rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
          />
        </div>

        <Button label="Save Formula" className="w-full" />
      </div>
    </div>
  );
}
