"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";

type Props = {
  mealIndex: number;
  itemIndex: number;
  item: {
    fieldId: string;
  };
  onRemove: () => void;
  readOnly?: boolean;
};

export default function DietMealItemRow({
  mealIndex,
  itemIndex,
  onRemove,
  readOnly,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<DietPlanFormInput>();

  const itemErrors = errors.meals?.[mealIndex]?.items?.[itemIndex];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.9fr_1fr_auto]">
        <div>
          <label className="mb-2 block text-sm font-medium">Food name</label>
          <input
            {...register(`meals.${mealIndex}.items.${itemIndex}.food_name`)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="e.g. Oats"
          />
          {itemErrors?.food_name && (
            <p className="mt-1 text-sm text-red-500">
              {itemErrors.food_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Quantity</label>
          <input
            {...register(`meals.${mealIndex}.items.${itemIndex}.quantity`)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="e.g. 100g"
          />
          {itemErrors?.quantity && (
            <p className="mt-1 text-sm text-red-500">
              {itemErrors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Notes</label>
          <input
            {...register(`meals.${mealIndex}.items.${itemIndex}.notes`)}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
            placeholder="Optional"
          />
        </div>

        {!readOnly && (
          <div className="flex items-end">
            <Button type="button" label="Remove" variant="danger" onClick={onRemove} />
          </div>
        )}
      </div>
    </div>
  );
}