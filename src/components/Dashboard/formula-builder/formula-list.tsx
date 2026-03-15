"use client";

import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type FormulaListProps = {
  formulas: FormulaDefinition[];
  selectedFormulaId: string;
  onSelect: (formulaId: string) => void;
};

export function FormulaList({
  formulas,
  selectedFormulaId,
  onSelect,
}: FormulaListProps) {
  return (
    <div className="rounded-xl border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-6">
        Formulas
      </div>

      <Button
        label="+ New Formula"
        size="xs"
        toastMessage="To develop"
        className="mb-3 w-full py-2"
      />

      <div className="grid gap-3">
        {formulas.map((formula) => {
          const isActive = formula.id === selectedFormulaId;

          return (
            <button
              key={formula.id}
              type="button"
              onClick={() => onSelect(formula.id)}
              className={cn(
                "rounded-[10px] border px-3 py-3 text-left transition-colors",
                isActive
                  ? "bg-primary/8 border-primary shadow-[inset_0_0_0_1px_rgba(87,80,241,0.2)]"
                  : "border-stroke/70 hover:border-primary/50 dark:border-dark-3 dark:hover:border-primary/40",
              )}
            >
              <div className="grid gap-2">
                <div className="font-semibold text-dark dark:text-white">
                  {formula.label}
                </div>
                <div className="text-[12px] text-dark-6">
                  {formula.key} {formula.unit ? `· ${formula.unit}` : ""}
                </div>
                <div className="line-clamp-2 rounded-[8px] bg-dark-2/50 px-2.5 py-2 font-mono text-[11px] text-white dark:bg-dark-4">
                  {formula.expression}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
