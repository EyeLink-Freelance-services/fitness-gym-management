import { Button } from "@/components/ui-elements/button";
import type { SchemaField } from "@/types/dashboard/coach-schema";

type FieldRowProps = {
  field: SchemaField;
  onEdit: () => void;
  onDelete: () => void;
};

export function FieldRow({ field, onEdit, onDelete }: FieldRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-stroke/70 px-4 py-3 dark:border-dark-3">
      <p className="text-sm font-semibold text-dark dark:text-white">
        {field.label}{" "}
        {field.unit && (
          <span className="text-xs text-dark-6 dark:text-dark-6">
            ({field.unit})
          </span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          label="Edit"
          size="xs"
          variant="green"
          onClick={onEdit}
        />
        <Button
          type="button"
          label="Delete"
          size="xs"
          variant="danger"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}
