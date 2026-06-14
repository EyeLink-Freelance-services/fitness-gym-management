"use client";

import { useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import type { CoachTrainingPlanDay } from "@/types/dashboard/client";
import type { PersonalCoachTrainingPlanFormData } from "@/types/forms";
import { useForm } from "react-hook-form";
import { Header } from "../FormElements/common";

const TRAINING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type PersonalCoachTrainingPlanFormProps = {
  initialData: PersonalCoachTrainingPlanFormData;
  mode?: "create" | "edit";
  visibleDays?: CoachTrainingPlanDay[];
  onSubmit: (values: PersonalCoachTrainingPlanFormData) => void;
  onCancel: () => void;
};

function toFormDayKey(day: CoachTrainingPlanDay) {
  return day.toLowerCase() as (typeof TRAINING_DAYS)[number];
}

export default function PersonalCoachTrainingPlanForm({
  initialData,
  mode = "create",
  visibleDays,
  onSubmit,
  onCancel,
}: PersonalCoachTrainingPlanFormProps) {
  const daysToRender = visibleDays?.map(toFormDayKey) ?? TRAINING_DAYS;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PersonalCoachTrainingPlanFormData>({
    mode: "all",
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const values = watch();
  const hasFilledDay = daysToRender.some((day) => values[day]?.trim());
  const canSubmit = mode === "edit" ? isValid : hasFilledDay;

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Training Plan"
        title={mode === "edit" ? "Edit training plan" : "Create training plan"}
        subtitle="Each client can have one training activity per day of the week."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputGroup
          type="text"
          label="Client Name"
          placeholder="Client name"
          inputProps={{
            value: initialData.clientName,
            readOnly: true,
          }}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {daysToRender.map((day) => (
            <InputGroup
              key={day}
              type="text"
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              placeholder="e.g. Chest, legs, rest"
              error={errors[day]?.message}
              inputProps={register(day, {
                validate: (value) => {
                  if (mode === "create") {
                    return true;
                  }

                  return value.trim().length > 0 || `${day} plan is required`;
                },
              })}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            label="Cancel"
            variant="outlineDark"
            className="w-full"
            onClick={onCancel}
          />
          <Button
            type="submit"
            label={mode === "edit" ? "Save Changes" : "Create Training Plan"}
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
