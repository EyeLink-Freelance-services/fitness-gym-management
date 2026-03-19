"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { createDefaultMeal } from "../helpers/default-values";
import DietMealCard from "./diet-meal-card";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";

type Props = {
  readOnly?: boolean;
};

export default function DietPlanMealsSection({ readOnly }: Props) {
  const { control, watch } = useFormContext<DietPlanFormInput>();

  const {
    fields: meals,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "meals",
    keyName: "fieldId",
  });

  const values = watch("meals");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Meals</h2>

        {!readOnly && (
          <Button
            type="button"
            variant="outlinePrimary"
            label="Add meal"
            onClick={() =>
              append(
                createDefaultMeal({
                  day_index: (values?.length ?? 0) + 1,
                  order_index: meals.length,
                })
              )
            }
          />
        )}
      </div>

      <div className="space-y-4">
        {meals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No meals yet
          </div>
        ) : (
          meals.map((meal, index) => (
            <DietMealCard
              key={meal.fieldId}
              index={index}
              onRemove={() => remove(index)}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </div>
  );
}