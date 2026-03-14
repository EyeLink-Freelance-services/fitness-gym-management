"use client";

import { cn } from "@/lib/utils";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";

type DynamicFormGroupProps = {
  group: FieldGroup;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

function renderInput(
  field: SchemaField,
  values: Record<string, string>,
  onChange: (key: string, value: string) => void,
) {
  const baseClassName =
    "h-11 w-full rounded-[8px] border border-stroke bg-transparent px-3 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white";
  const value = values[field.key] ?? "";

  if (field.type === "dropdown") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        className={baseClassName}
      >
        <option value="">Select option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-[10px] border border-stroke px-4 py-3 dark:border-dark-3">
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(event) => onChange(field.key, String(event.target.checked))}
        />
        <span className="text-sm text-dark dark:text-white">{field.label}</span>
      </label>
    );
  }

  return (
    <input
      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
      value={value}
      readOnly={field.readOnly}
      onChange={(event) => onChange(field.key, event.target.value)}
      className={cn(baseClassName, field.readOnly && "opacity-70")}
      placeholder={field.placeholder ?? field.label}
    />
  );
}

export function DynamicFormGroup({
  group,
  values,
  onChange,
}: DynamicFormGroupProps) {
  const isLifestyleGroup = /lifestyle/i.test(group.name);

  return (
    <section className="rounded-[12px] border border-stroke/70 bg-white p-0 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke/70 px-4 py-3 dark:border-dark-3">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-primary/15 text-[10px] font-bold text-primary">
            {isLifestyleGroup ? "L" : "F"}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold text-dark dark:text-white">
              {group.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-dark-5">
          <span>{group.fields.length} fields</span>
          {group.unitHint && <span>· {group.unitHint}</span>}
        </div>
      </div>

      <div className="grid gap-3 px-4 py-4 md:grid-cols-2 xl:grid-cols-6">
        {group.fields.map((field) => (
          <label
            key={field.id}
            className={cn(
              "grid gap-1.5",
              field.type === "text" && "md:col-span-2 xl:col-span-6",
              field.type === "boolean" && "md:col-span-2 xl:col-span-2",
              isLifestyleGroup &&
                field.type === "dropdown" &&
                /sleep|stress|activity/i.test(field.label) &&
                "xl:col-span-2",
            )}
          >
            {field.type !== "boolean" && (
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5">
                {field.label}
                {field.unit ? ` · ${field.unit}` : ""}
              </span>
            )}
            {renderInput(field, values, onChange)}
          </label>
        ))}
      </div>
    </section>
  );
}
