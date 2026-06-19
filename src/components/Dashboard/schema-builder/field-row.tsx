import { Button } from "@/components/ui-elements/button";
import type { SchemaField } from "@/types/dashboard/coach-schema";

type FieldRowProps = {
  field: SchemaField;
  onEdit?: () => void;
};

export function FieldRow({ field, onEdit }: FieldRowProps) {
  return (
    <div
      role={onEdit ? "button" : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (!onEdit) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-stroke/70 px-4 py-3 dark:border-dark-3 ${
        onEdit
          ? "cursor-pointer transition hover:border-primary/40 hover:bg-gray-1/80 dark:hover:bg-dark-2/80"
          : ""
      }`}
    >
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

        <Button
          type="button"
          label="Edit"
          size="xs"
          variant="green"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        />
        <Button
          type="button"
          label="Delete"
          size="xs"
          variant="danger"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
