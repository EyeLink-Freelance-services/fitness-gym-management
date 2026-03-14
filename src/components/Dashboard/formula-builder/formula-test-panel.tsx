"use client";

import {
  evaluateFormulaCollection,
  evaluateFormulaPreview,
} from "@/lib/formula/preview-engine";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { useEffect, useMemo, useState } from "react";

type FormulaTestPanelProps = {
  formula: FormulaDefinition;
  expression: string;
  formulas: FormulaDefinition[];
  sampleValues: Record<string, number>;
};

function formatNumber(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function FormulaTestPanel({
  formula,
  expression,
  formulas,
  sampleValues,
}: FormulaTestPanelProps) {
  const initialValues = useMemo(() => {
    return Object.fromEntries(
      formula.detectedVariables.map((item) => [
        item.key,
        sampleValues[item.key] ?? 0,
      ]),
    );
  }, [formula.detectedVariables, sampleValues]);

  const [values, setValues] = useState<Record<string, number>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const result = useMemo(() => {
    try {
      const resolvedScope = evaluateFormulaCollection(formulas, values);
      return {
        valid: true,
        value: evaluateFormulaPreview(expression, resolvedScope),
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Preview failed.",
      };
    }
  }, [expression, formulas, values]);

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-5">
          Test Panel
        </h3>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3 grid-cols-2">
          {formula.detectedVariables.map((item) => (
            <label key={item.key} className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-dark-5">
                {item.label}
              </span>
              <input
                type="number"
                value={values[item.key] ?? 0}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [item.key]: Number(event.target.value),
                  }))
                }
                className="rounded-[10px] border border-stroke bg-transparent px-4 py-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </label>
          ))}
        </div>

        <div className="rounded-[10px] border border-stroke/70 bg-dark-2/30 p-4 text-center dark:border-dark-3 dark:bg-dark-2/70">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-dark-5">
            {formula.label} Result
          </div>
          <div className="mt-1 text-xs text-dark-5">{formula.unit ?? ""}</div>
          <div className="mt-3 text-3xl font-bold text-primary">
            {result.valid && typeof result.value === "number"
              ? `${formatNumber(result.value, formula.decimals)}${formula.unit ? ` ${formula.unit}` : ""}`
              : "—"}
          </div>
          {!result.valid && (
            <p className="mt-2 text-sm text-red">{result.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
