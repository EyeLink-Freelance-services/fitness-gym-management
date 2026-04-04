"use client";

import { useEffect } from "react";
import Header from "@/components/FormElements/common/header";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import type { PersonalCoachTrainingPlanFormData } from "@/types/forms";
import { useForm } from "react-hook-form";

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
  onSubmit: (values: PersonalCoachTrainingPlanFormData) => void;
  onCancel: () => void;
};

export default function PersonalCoachTrainingPlanForm({
  initialData,
  mode = "create",
  onSubmit,
  onCancel,
}: PersonalCoachTrainingPlanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PersonalCoachTrainingPlanFormData>({
    mode: "all",
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Training Plan"
        title={mode === "edit" ? "Edit training plan" : "Create training plan"}
        subtitle="Create a 7-day training split for this client with repeat options."
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
          {TRAINING_DAYS.map((day) => (
            <InputGroup
              key={day}
              type="text"
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              placeholder="e.g. Chest, legs, rest"
              error={errors[day]?.message}
              inputProps={register(day, {
                validate: (value) =>
                  value.trim().length > 0 || `${day} plan is required`,
              })}
            />
          ))}
        </div>

        <div className="rounded-xl border border-stroke p-4 dark:border-dark-3">
          <p className="text-sm font-semibold text-dark dark:text-white">
            Repeat plan
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <label className="flex items-center gap-3 text-sm text-dark dark:text-white">
              <input
                type="checkbox"
                className="size-4 rounded border-stroke accent-primary"
                {...register("repeatEveryWeek")}
              />
              Repeat every week
            </label>
            <label className="flex items-center gap-3 text-sm text-dark dark:text-white">
              <input
                type="checkbox"
                className="size-4 rounded border-stroke accent-primary"
                {...register("repeatEveryMonth")}
              />
              Repeat every month
            </label>
          </div>
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
            disabled={!isValid || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
