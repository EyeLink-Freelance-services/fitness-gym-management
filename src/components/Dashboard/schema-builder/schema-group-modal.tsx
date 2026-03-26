"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui-elements/button";
import {
  type SchemaGroupModalFormValues,
  schemaGroupModalFormSchema,
} from "@/lib/validation/schemas/schema-group-modal";
import type { FieldGroup } from "@/types/dashboard/coach-schema";

type SchemaGroupModalProps = {
  open: boolean;
  mode: "add" | "edit";
  group: FieldGroup | null;
  nextSortOrder: number;
  onClose: () => void;
  onSave: (group: FieldGroup) => void;
};

function fieldLabelClass() {
  return "text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-5 dark:text-dark-6";
}

export function SchemaGroupModal({
  open,
  mode,
  group,
  nextSortOrder,
  onClose,
  onSave,
}: SchemaGroupModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchemaGroupModalFormValues>({
    resolver: zodResolver(schemaGroupModalFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && group) {
      reset({
        name: group.name,
        description: group.description ?? "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [open, mode, group, reset]);

  const submit = (values: SchemaGroupModalFormValues) => {
    const name = values.name.trim();
    const description = values.description?.trim();
    if (mode === "edit" && group) {
      onSave({
        ...group,
        name,
        description: description ? description : undefined,
      });
    } else {
      onSave({
        id: `schema-group-${Date.now()}`,
        name,
        description: description ? description : undefined,
        accentColor: "from-primary/20 to-primary/5",
        sortOrder: nextSortOrder,
        fields: [],
      });
    }
    onClose();
  };

  const title = mode === "add" ? "Add group" : "Edit group";
  const primaryLabel = mode === "add" ? "Add group" : "Save changes";

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex min-h-0 flex-1 flex-col gap-5"
      >
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          <InputGroup
            type="text"
            label="Name"
            placeholder="e.g. Client Basics"
            required
            labelClassName={fieldLabelClass()}
            inputProps={register("name")}
            error={errors.name?.message}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextAreaGroup
                label="Description"
                placeholder="Optional - a short note for coaches building the schema"
                labelClassName={fieldLabelClass()}
                textareaProps={{
                  ...field,
                  value: field.value ?? "",
                  rows: 4,
                }}
                error={errors.description?.message}
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
          />
        </div>
      </form>
    </Modal>
  );
}
