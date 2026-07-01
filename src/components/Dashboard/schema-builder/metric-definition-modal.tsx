"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputGroup from "@/components/FormElements/InputGroup";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui-elements/button";
import {
  type MetricDefinitionModalFormValues,
  metricDefinitionModalFormSchema,
} from "@/lib/validation/schemas/metric-definition-modal";
import type { MetricDefinitionFormValues } from "@/types/dashboard/client-metric-definition";

type MetricDefinitionModalProps = {
  open: boolean;
  mode: "add" | "edit";
  defaultGroup?: string;
  values?: MetricDefinitionFormValues | null;
  onClose: () => void;
  onSave: (values: MetricDefinitionFormValues) => void | Promise<void>;
  isSaving?: boolean;
};

function fieldLabelClass() {
  return "text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-5 dark:text-dark-6";
}

export function MetricDefinitionModal({
  open,
  mode,
  defaultGroup = "",
  values,
  onClose,
  onSave,
  isSaving = false,
}: MetricDefinitionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetricDefinitionModalFormValues>({
    resolver: zodResolver(metricDefinitionModalFormSchema),
    defaultValues: {
      label: "",
      unit: "",
      group: defaultGroup,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && values) {
      reset(values);
      return;
    }

    reset({
      label: "",
      unit: "",
      group: defaultGroup,
    });
  }, [open, mode, values, defaultGroup, reset]);

  const submit = async (formValues: MetricDefinitionModalFormValues) => {
    await onSave({
      label: formValues.label.trim(),
      unit: formValues.unit.trim(),
      group: formValues.group.trim(),
    });
  };

  const title = mode === "add" ? "Add Field" : "Edit Field";
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
            placeholder="e.g. Weight"
            required
            labelClassName={fieldLabelClass()}
            inputProps={register("label")}
            error={errors.label?.message}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputGroup
              type="text"
              label="Unit"
              placeholder="kg, mm, cm…"
              required
              labelClassName={fieldLabelClass()}
              inputProps={register("unit")}
              error={errors.unit?.message}
            />
            <InputGroup
              type="text"
              label="Group"
              placeholder="e.g. Basic"
              required
              labelClassName={fieldLabelClass()}
              inputProps={register("group")}
              error={errors.group?.message}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-stroke/70 pt-5 dark:border-dark-3">
          <Button
            type="button"
            variant="outlineDark"
            size="small"
            label="Cancel"
            onClick={onClose}
            disabled={isSaving}
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            label={primaryLabel}
            disabled={isSaving}
          />
        </div>
      </form>
    </Modal>
  );
}
