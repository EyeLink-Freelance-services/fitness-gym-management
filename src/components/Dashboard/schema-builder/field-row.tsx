import { Button } from "@/components/ui-elements/button";
import type { SchemaField } from "@/types/dashboard/coach-schema";

type FieldRowProps = {
  field: SchemaField;
};

export function FieldRow({ field }: FieldRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-stroke/70 px-4 py-3 dark:border-dark-3">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-dark dark:text-white">
          {field.label}{" "}
          <span className="text-xs text-dark-6 dark:text-dark-6">
            {field.unit && <>({field.unit})</>}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 dark:text-dark-6">
        {field.validation?.min !== undefined && (
          <span className="text-[11px]">min {field.validation.min}</span>
        )}
        {field.validation?.max !== undefined && (
          <span className="text-[11px]">max {field.validation.max}</span>
        )}

        <Button label="Edit" size="xs" variant="green" />
        <Button label="Delete" size="xs" variant="danger" />
      </div>
    </div>
  );
}
