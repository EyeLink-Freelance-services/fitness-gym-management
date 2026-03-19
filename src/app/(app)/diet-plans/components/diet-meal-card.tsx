"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { createDefaultMealItem } from "../helpers/default-values";
import DietMealItemRow from "./diet-meal-item-row";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { CloseButton } from "@/components/ui-elements/close-button";

type Props = {
  index: number;
  onRemove: () => void;
  readOnly?: boolean;
};

export default function DietMealCard({
  index,
  onRemove,
  readOnly,
}: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<DietPlanFormInput>();

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `meals.${index}.items`,
    keyName: "fieldId",
  });

  const mealErrors = errors.meals?.[index];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">Day</label>
            <input
              type="number"
              {...register(`meals.${index}.day_index`, { valueAsNumber: true })}
              readOnly={readOnly}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            {mealErrors?.day_index && (
              <p className="mt-1 text-sm text-red-500">
                {mealErrors.day_index.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Meal type</label>
            <select
              {...register(`meals.${index}.meal_type`)}
              disabled={readOnly}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            {mealErrors?.meal_type && (
              <p className="mt-1 text-sm text-red-500">
                {mealErrors.meal_type.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Order</label>
            <input
              type="number"
              {...register(`meals.${index}.order_index`, {
                valueAsNumber: true,
              })}
              readOnly={readOnly}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        {!readOnly && (
          <CloseButton onClick={onRemove} variant="danger"/>
          // <Button type="button" variant="danger" onClick={onRemove} label="Remove meal"/>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Meal notes</label>
        <textarea
          {...register(`meals.${index}.notes`)}
          readOnly={readOnly}
          rows={3}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          placeholder="Optional meal notes"
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Meal items</h3>

        {!readOnly && (
          <Button
            type="button"
            variant="outlinePrimary"
            label="Add item"
            onClick={() =>
              append(createDefaultMealItem({ order_index: items.length }))
            }
          />
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, itemIndex) => (
          <DietMealItemRow
            key={item.fieldId}
            mealIndex={index}
            itemIndex={itemIndex}
            item={item}
            onRemove={() => remove(itemIndex)}
            readOnly={readOnly}
          />
        ))}
      </div>

      {typeof mealErrors?.items?.message === "string" && (
        <p className="mt-2 text-sm text-red-500">{mealErrors.items.message}</p>
      )}
    </div>
  );
}