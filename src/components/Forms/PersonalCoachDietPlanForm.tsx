"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import type { PersonalCoachDietPlanFormData } from "@/types/forms";
import { Header } from "../FormElements/common";

const MEAL_TIME_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Specific"] as const;

type PersonalCoachDietPlanFormProps = {
  initialData: PersonalCoachDietPlanFormData;
  mode?: "create" | "edit";
  onSubmit: (values: PersonalCoachDietPlanFormData) => void;
  onCancel: () => void;
};

function createEmptyMeal() {
  return {
    timeSlot: "Breakfast" as const,
    specificTime: "",
    meal: "",
  };
}

function isMealComplete(meal: PersonalCoachDietPlanFormData["meals"][number]) {
  if (!meal.meal.trim()) {
    return false;
  }

  if (meal.timeSlot === "Specific") {
    return Boolean(meal.specificTime?.trim());
  }

  return true;
}

export default function PersonalCoachDietPlanForm({
  initialData,
  mode = "create",
  onSubmit,
  onCancel,
}: PersonalCoachDietPlanFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PersonalCoachDietPlanFormData>({
    mode: "all",
    defaultValues: {
      ...initialData,
      meals:
        initialData.meals.length > 0
          ? initialData.meals
          : [createEmptyMeal()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meals",
  });

  useEffect(() => {
    reset({
      ...initialData,
      meals:
        initialData.meals.length > 0
          ? initialData.meals
          : [createEmptyMeal()],
    });
  }, [initialData, reset]);

  const meals = watch("meals");
  const canAddMeal = meals.length > 0 && meals.every(isMealComplete);

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Diet Plan"
        title={mode === "edit" ? "Edit diet plan" : "Create diet plan"}
        subtitle="Create a meal structure for this client with editable meal timing."
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

        <div className="space-y-4">
          {fields.map((field, index) => {
            const isSpecific = meals[index]?.timeSlot === "Specific";

            return (
              <div
                key={field.id}
                className="rounded-xl border border-stroke p-4 dark:border-dark-3"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-dark dark:text-white">
                    Meal {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      label="Remove"
                      size="xs"
                      variant="outlineDark"
                      onClick={() => remove(index)}
                    />
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    name={`meals.${index}.timeSlot`}
                    control={control}
                    rules={{ required: "Time is required" }}
                    render={({ field: controllerField }) => (
                      <Select
                        label="Time"
                        placeholder="Select time"
                        items={MEAL_TIME_OPTIONS.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        error={errors.meals?.[index]?.timeSlot?.message}
                        selectProps={{
                          ...controllerField,
                          required: true,
                        }}
                      />
                    )}
                  />

                  {isSpecific ? (
                    <InputGroup
                      type="time"
                      label="Specific Time"
                      placeholder="Select time"
                      error={errors.meals?.[index]?.specificTime?.message}
                      inputProps={register(`meals.${index}.specificTime`, {
                        validate: (value) =>
                          meals[index]?.timeSlot !== "Specific" ||
                          value?.trim() ||
                          "Specific time is required",
                      })}
                    />
                  ) : (
                    <div />
                  )}
                </div>

                <InputGroup
                  className="mt-4"
                  type="text"
                  label="Meal"
                  placeholder='e.g. eggs, bread, 3 potatoes'
                  error={errors.meals?.[index]?.meal?.message}
                  inputProps={register(`meals.${index}.meal`, {
                    validate: (value) =>
                      value.trim().length > 0 || "Meal is required",
                  })}
                />
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          label="+ Add Meal"
          variant="outlineDark"
          onClick={() => append(createEmptyMeal())}
          disabled={!canAddMeal}
        />

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
            label={mode === "edit" ? "Save Changes" : "Create Diet Plan"}
            className="w-full"
            disabled={!isValid || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
