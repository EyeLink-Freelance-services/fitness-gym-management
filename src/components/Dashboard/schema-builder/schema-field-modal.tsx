"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ChevronUpIcon } from "@/components/IconsCollection/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui-elements/button";
import {
  ensureUniqueFieldKey,
  generateFieldKeyFromLabel,
} from "@/lib/validation/helpers/schema-field-key";
import {
  type SchemaFieldModalFormValues,
  schemaFieldModalFormSchema,
} from "@/lib/validation/schemas/schema-field-modal";
import type { FieldOption, FieldType, SchemaField } from "@/types/dashboard/coach-schema";

const fieldTypeItems: { value: FieldType; label: string }[] = [
  { value: "number", label: "Number" },
  { value: "text", label: "Text" },
  { value: "dropdown", label: "Dropdown" },
];

const emptyOptionRow = { label: "", value: "" };

type SchemaFieldModalProps = {
  open: boolean;
  mode: "add" | "edit";
  groups: { id: string; name: string }[];
  defaultGroupId: string;
  field: SchemaField | null;
  existingKeys: Set<string>;
  onClose: () => void;
  onSave: (field: SchemaField) => void;
};

function fieldLabelClass() {
  return "text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-5 dark:text-dark-6";
}

function getDefaultValues(
  mode: "add" | "edit",
  field: SchemaField | null,
  defaultGroupId: string,
): SchemaFieldModalFormValues {
  if (mode === "edit" && field) {
    const opts =
      field.type === "dropdown" && field.options?.length
        ? field.options.map((o) => ({ label: o.label, value: o.value }))
        : [];

    return {
      label: field.label,
      type: field.type,
      unit: field.unit ?? "",
      min:
        field.validation?.min !== undefined
          ? String(field.validation.min)
          : "",
      max:
        field.validation?.max !== undefined
          ? String(field.validation.max)
          : "",
      groupId: field.groupId,
      options:
        field.type === "dropdown"
          ? opts.length > 0
            ? opts
            : [emptyOptionRow]
          : [],
    };
  }

  return {
    label: "",
    type: "number",
    unit: "",
    min: "",
    max: "",
    groupId: defaultGroupId,
    options: [],
  };
}

export function SchemaFieldModal(props: SchemaFieldModalProps) {
  const instanceKey = props.open
    ? `${props.mode}:${props.field?.id ?? "new"}:${props.defaultGroupId}`
    : "closed";

  return <SchemaFieldModalForm key={instanceKey} {...props} />;
}

function SchemaFieldModalForm({
  open,
  mode,
  groups,
  defaultGroupId,
  field,
  existingKeys,
  onClose,
  onSave,
}: SchemaFieldModalProps) {
  const groupItems = useMemo(
    () => groups.map((g) => ({ value: g.id, label: g.name })),
    [groups],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SchemaFieldModalFormValues>({
    resolver: zodResolver(schemaFieldModalFormSchema),
    defaultValues: getDefaultValues(mode, field, defaultGroupId),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const fieldType = useWatch({ control, name: "type" });
  const typeField = register("type");

  const submit = (values: SchemaFieldModalFormValues) => {
    const trimmed = values.label.trim();
    const baseKey =
      mode === "edit" && field && trimmed === field.label.trim()
        ? field.key
        : generateFieldKeyFromLabel(trimmed);
    const keysForUniqueness = new Set(existingKeys);
    if (mode === "edit" && field) {
      keysForUniqueness.delete(field.key);
    }
    const key = ensureUniqueFieldKey(baseKey, keysForUniqueness);

    const validation =
      values.type === "number" &&
      (values.min?.trim() || values.max?.trim())
        ? {
            min: values.min?.trim() ? Number(values.min) : undefined,
            max: values.max?.trim() ? Number(values.max) : undefined,
          }
        : undefined;

    let options: FieldOption[] | undefined;
    if (values.type === "dropdown") {
      options = (values.options ?? [])
        .map((o) => ({
          label: o.label.trim(),
          value: o.value.trim(),
        }))
        .filter((o) => o.label && o.value);
    }

    const next: SchemaField = {
      id: field?.id ?? `schema-field-${key}`,
      groupId: values.groupId,
      label: trimmed,
      key,
      type: values.type,
      unit:
        values.type === "dropdown"
          ? undefined
          : values.unit?.trim()
            ? values.unit.trim()
            : undefined,
      required: field?.required ?? true,
      readOnly: field?.readOnly,
      showPortal: field?.showPortal,
      sortOrder: field?.sortOrder ?? 0,
      validation,
      options,
    };

    onSave(next);
    onClose();
  };

  const title = mode === "add" ? "Add New Field" : "Edit Field";
  const primaryLabel = mode === "add" ? "Add Field" : "Save changes";

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex min-h-0 flex-1 flex-col gap-5"
      >
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          <InputGroup
            type="text"
            label="Field label"
            placeholder="e.g. Chest (mm)"
            required
            labelClassName={fieldLabelClass()}
            inputProps={register("label")}
            error={errors.label?.message}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className={`space-y-3 ${fieldType === "dropdown" ? "sm:col-span-2" : ""}`}
            >
              <label
                htmlFor="schema-field-type"
                className={`block ${fieldLabelClass()}`}
              >
                Type
              </label>
              <div className="relative">
                <select
                  id="schema-field-type"
                  {...typeField}
                  onChange={(e) => {
                    typeField.onChange(e);
                    setValue(
                      "options",
                      e.target.value === "dropdown" ? [emptyOptionRow] : [],
                    );
                  }}
                  className="w-full appearance-none rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 pr-10 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                >
                  {fieldTypeItems.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
              </div>
            </div>

            {fieldType !== "dropdown" && (
              <InputGroup
                type="text"
                label="Unit"
                placeholder="kg, mm, cm…"
                labelClassName={fieldLabelClass()}
                inputProps={register("unit")}
                error={errors.unit?.message}
              />
            )}
          </div>

          {fieldType === "dropdown" && (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <span className={fieldLabelClass()}>Dropdown options</span>
                <Button
                  type="button"
                  size="xs"
                  variant="outlineDark"
                  label="+ Add option"
                  onClick={() => append(emptyOptionRow)}
                />
              </div>
              <p className="text-body-xs text-dark-5 dark:text-dark-6">
                Label is shown in data entry; value is what gets saved (keep
                values unique).
              </p>
              <div className="space-y-2 rounded-lg border border-stroke/70 p-3 dark:border-dark-3">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 text-[10px] font-semibold uppercase tracking-wider text-dark-5 dark:text-dark-6">
                  <span>Label</span>
                  <span>Value</span>
                  <span className="sr-only">Remove</span>
                </div>
                {fields.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Shown in lists"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      {...register(`options.${index}.label` as const)}
                    />
                    <input
                      type="text"
                      placeholder="Stored value"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      {...register(`options.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      size="xs"
                      variant="outlineDark"
                      label="×"
                      className="min-w-[2.25rem] px-0"
                      onClick={() => {
                        if (fields.length > 1) remove(index);
                        else {
                          setValue("options.0.label", "");
                          setValue("options.0.value", "");
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              {errors.options?.message && (
                <p className="text-body-sm text-red-500 dark:text-red-400">
                  {errors.options.message}
                </p>
              )}
            </div>
          )}

          {fieldType === "number" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputGroup
                type="text"
                label="Min value"
                placeholder="0"
                labelClassName={fieldLabelClass()}
                inputProps={{
                  ...register("min"),
                  className: "no-spinner",
                }}
                error={errors.min?.message}
              />
              <InputGroup
                type="text"
                label="Max value"
                placeholder="100"
                labelClassName={fieldLabelClass()}
                inputProps={{
                  ...register("max"),
                  className: "no-spinner",
                }}
                error={errors.max?.message}
              />
            </div>
          )}

          <Controller
            control={control}
            name="groupId"
            render={({ field: f }) => (
              <Select
                label="Field group"
                labelClassName={fieldLabelClass()}
                placeholder="Select group"
                items={groupItems}
                selectProps={{
                  ...f,
                  value: f.value,
                }}
                error={errors.groupId?.message}
              />
            )}
          />
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-stroke/70 pt-5 dark:border-dark-3">
          <Button
            type="button"
            variant="outlineDark"
            size="small"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            label={primaryLabel}
            loadingLabel="Saving..."
            loading={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
}
