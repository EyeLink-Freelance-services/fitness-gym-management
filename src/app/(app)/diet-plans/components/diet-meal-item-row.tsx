"use client";

import { useFormContext } from "react-hook-form";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { CloseButton } from "@/components/ui-elements/close-button";
import { FieldLabel, Input } from "@/components/FormElements/Input/input";

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
  const basePath = `meals.${mealIndex}.items.${itemIndex}` as const;

  return (
    <div className="rounded-[22px] border border-stroke/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr_1fr_auto] xl:items-end">
        <div>
          <FieldLabel>Food name</FieldLabel>
          <Input
            {...register(`${basePath}.food_name`)}
            readOnly={readOnly}
            placeholder="e.g. Oats"
          />
          {itemErrors?.food_name && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {itemErrors.food_name.message}
            </p>
          )}
        </div>

        <div>
          <FieldLabel>Quantity</FieldLabel>
          <Input
            {...register(`${basePath}.quantity`)}
            readOnly={readOnly}
            placeholder="e.g. 100g"
          />
          {itemErrors?.quantity && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {itemErrors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <Input
            {...register(`${basePath}.notes`)}
            readOnly={readOnly}
            placeholder="Optional"
          />
          {itemErrors?.notes && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {itemErrors.notes.message}
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex xl:justify-end">
            <CloseButton onClick={onRemove} variant="danger" />
          </div>
        )}
      </div>
    </div>
  );
}