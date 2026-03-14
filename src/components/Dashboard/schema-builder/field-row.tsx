import { StatusBadge } from "@/components/ui-elements/status-badge";
import type { SchemaField } from "@/types/dashboard/coach-schema";

type FieldRowProps = {
  field: SchemaField;
};

function getTypeTone(type: SchemaField["type"]) {
  switch (type) {
    case "number":
      return "primary";
    case "dropdown":
      return "warning";
    case "boolean":
      return "success";
    case "date":
      return "danger";
    default:
      return "neutral";
  }
}

function getTypeMonogram(type: SchemaField["type"]) {
  switch (type) {
    case "number":
      return "123";
    case "text":
      return "Abc";
    case "boolean":
      return "?";
    case "dropdown":
      return "•";
    case "date":
      return "D";
    default:
      return "•";
  }
}

export function FieldRow({ field }: FieldRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] border border-stroke/70 px-4 py-3 dark:border-dark-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-cyan-400/10 text-xs font-bold text-cyan-300">
          {getTypeMonogram(field.type)}
        </div>
        <div>
          <div className="text-sm font-semibold text-dark dark:text-white">
            {field.label}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-dark-6 dark:text-dark-5">
            <span className="rounded-[8px] bg-dark-2 px-2 py-1 dark:bg-dark-3">
              {field.key}
            </span>
            {field.unit && <span>{field.unit}</span>}
            <StatusBadge label={field.type} tone={getTypeTone(field.type)} />
            <StatusBadge
              label={field.required ? "required" : "optional"}
              tone={field.required ? "success" : "neutral"}
            />
            {field.readOnly && <StatusBadge label="read-only" tone="warning" />}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {field.validation?.min !== undefined && (
          <span className="text-[11px] text-dark-5">min {field.validation.min}</span>
        )}
        {field.validation?.max !== undefined && (
          <span className="text-[11px] text-dark-5">max {field.validation.max}</span>
        )}
        <button
          type="button"
          className="rounded-[8px] border border-stroke px-2 py-1 text-xs text-dark-6 hover:border-primary hover:text-primary dark:border-dark-3"
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-[8px] border border-red/30 px-2 py-1 text-xs text-red hover:bg-red/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
