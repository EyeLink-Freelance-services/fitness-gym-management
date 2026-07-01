"use client";

import {
  appendExpressionToken,
  EXPRESSION_PICKER_OPERATORS,
} from "@/lib/formula/variable-utils";
import { cn } from "@/lib/utils";
import type { SchemaField } from "@/types/dashboard/coach-schema";

type FormulaExpressionPickerProps = {
  fields: SchemaField[];
  expression: string;
  onExpressionChange: (expression: string) => void;
};

export function FormulaExpressionPicker({
  fields,
  expression,
  onExpressionChange,
}: FormulaExpressionPickerProps) {
  const numberFields = fields.filter((field) => field.type === "number");

  const insert = (token: string) => {
    onExpressionChange(appendExpressionToken(expression, token));
  };

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="grid gap-5">
        <div>
          <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-6">
            Schema Fields
          </h3>
          <div className="flex flex-wrap gap-2">
            {numberFields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => insert(field.key)}
                className={cn(
                  "rounded-full border border-stroke/70 px-3 py-1.5 text-left text-sm transition-colors",
                  "bg-dark-2/30 text-dark hover:border-primary hover:bg-primary/10 hover:text-primary",
                  "dark:border-dark-3 dark:bg-dark-2/70 dark:text-white dark:hover:border-primary",
                )}
              >
                <span className="font-medium">{field.label}</span>
                {field.unit ? (
                  <span className="ml-1.5 text-xs text-dark-5">{field.unit}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-6">
            Operators
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXPRESSION_PICKER_OPERATORS.map((operator) => (
              <button
                key={operator}
                type="button"
                onClick={() => insert(operator)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-[8px] border border-stroke/70 text-sm font-medium transition-colors",
                  "bg-dark-2/30 text-dark hover:border-primary hover:bg-primary/10 hover:text-primary",
                  "dark:border-dark-3 dark:bg-dark-2/70 dark:text-white dark:hover:border-primary",
                )}
              >
                {operator}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
