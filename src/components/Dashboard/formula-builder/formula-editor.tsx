"use client";

import { getAutocompleteItems } from "@/lib/formula/variable-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui-elements/button";
import type {
  FormulaDefinition,
  FormulaValidationResult,
} from "@/types/dashboard/formula-builder";
import { useMemo, useState } from "react";

type FormulaEditorProps = {
  formula: FormulaDefinition;
  expression: string;
  onExpressionChange: (expression: string) => void;
  validation: FormulaValidationResult;
  knownVariables: string[];
};

const supportedFunctions = [
  "abs",
  "sqrt",
  "pow",
  "log",
  "log10",
  "round",
  "floor",
  "ceil",
  "min",
  "max",
  "sin",
  "cos",
  "tan",
];

export function FormulaEditor({
  formula,
  expression,
  onExpressionChange,
  validation,
  knownVariables,
}: FormulaEditorProps) {
  const [cursorPosition, setCursorPosition] = useState(expression.length);

  const suggestions = useMemo(
    () => getAutocompleteItems(expression, cursorPosition, knownVariables).slice(0, 6),
    [cursorPosition, expression, knownVariables],
  );

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-body-2xlg font-bold text-dark dark:text-white">
              {formula.label}
            </h3>
            <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green">
              {formula.activeVersion} active
            </span>
          </div>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-5">
            Key: `{formula.key}` {formula.unit ? `· Unit ${formula.unit}` : ""} ·
            {" "}Decimals {formula.decimals}
          </p>
          {formula.description && (
            <p className="mt-2 text-sm text-dark-6 dark:text-dark-5">
              {formula.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button label="Duplicate" size="small" variant="outlineDark" />
          <Button label="Delete" size="small" variant="outlineDark" />
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
              Show Portal
            </span>
            <select
              value={formula.showPortal ? "yes" : "no"}
              disabled
              className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark dark:border-dark-3 dark:text-white"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
            Expression - use field keys and formula keys as variables
          </label>
          <textarea
            value={expression}
            onChange={(event) => {
              setCursorPosition(event.target.selectionStart ?? event.target.value.length);
              onExpressionChange(event.target.value);
            }}
            onClick={(event) => setCursorPosition(event.currentTarget.selectionStart ?? 0)}
            onKeyUp={(event) =>
              setCursorPosition((event.currentTarget as HTMLTextAreaElement).selectionStart ?? 0)
            }
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
              {validation.valid ? "Expression valid" : validation.error ?? "Needs attention"}
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
                {variable} {validation.unknownVariables.includes(variable) ? "" : "✓"}
              </span>
            ))}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-dark-5">
              Suggestions
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onExpressionChange(`${expression}${item.slice(0)}`)}
                  className="rounded-full border border-stroke px-3 py-1 text-xs text-dark-6 hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-5"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

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

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
            Supported Functions
          </div>
          <div className="flex flex-wrap gap-2">
            {supportedFunctions.map((item) => (
              <span
                key={item}
                className="rounded-full bg-dark-2 px-3 py-1 text-xs text-dark-6 dark:bg-dark-3 dark:text-dark-5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
          <Button label="Test Formula" variant="outlineDark" className="w-full" />
          <Button label="Save Formula" className="w-full" />
        </div>
      </div>
    </div>
  );
}
