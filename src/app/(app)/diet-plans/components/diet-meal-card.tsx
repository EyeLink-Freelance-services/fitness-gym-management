"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { createDefaultMealItem } from "../helpers/default-values";
import DietMealItemRow from "./diet-meal-item-row";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { CloseButton } from "@/components/ui-elements/close-button";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";

type Props = {
  index: number;
  dayIndex: number;
  onRemove: () => void;
  readOnly?: boolean;
};

const mealTypeItems = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export default function DietMealCard({
  index,
  dayIndex,
  onRemove,
  readOnly,
}: Props) {
  const {
    control,
    register,
    watch,
    setValue,
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
  const mealType = watch(`meals.${index}.meal_type`);

  const mealTitle = mealType
    ? `${mealType.charAt(0).toUpperCase()}${mealType.slice(1)}`
    : "Meal";

  return (
    <div className="overflow-hidden rounded-[20px] bg-white/80 shadow-sm dark:border-dark-3 dark:bg-dark-2/70">
      <div className="flex items-start justify-between gap-3 border-b border-stroke/70 px-4 py-4 dark:border-dark-3">
        <div>
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {mealTitle}
          </div>
          <h4 className="mt-3 text-lg font-semibold text-dark dark:text-white">
            Meal Details
          </h4>
          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            Configure this meal for day {dayIndex}.
          </p>
        </div>

        {!readOnly && <CloseButton onClick={onRemove} variant="danger" />}
      </div>

      <div className="space-y-5 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Meal type"
            placeholder="Select meal type"
            items={mealTypeItems}
            error={mealErrors?.meal_type?.message}
            defaultValue={mealType}
            selectProps={{
              disabled: readOnly,
              onChange: (e) => {
                setValue(
                  `meals.${index}.meal_type`,
                  e.target.value as "breakfast" | "lunch" | "dinner" | "snack",
                  { shouldValidate: true }
                );
              },
            }}
          />

          <InputGroup
            label="Order"
            labelClassName="text-sm font-medium"
            type="number"
            placeholder="1"
            error={mealErrors?.order_index?.message}
            inputProps={{
              ...register(`meals.${index}.order_index`, {
                valueAsNumber: true,
              }),
              readOnly,
              min: 0,
            }}
          />
        </div>

        <TextAreaGroup
          label="Meal notes"
          labelClassName="text-sm font-medium"
          placeholder="Optional meal notes..."
          error={mealErrors?.notes?.message}
          textareaProps={{
            ...register(`meals.${index}.notes`),
            readOnly,
            rows: 3,
            className: "resize-none",
          }}
        />

        <div className="rounded-[18px]  border-stroke/70 bg-white/50 p-4 dark:border-dark-3 dark:bg-dark/40">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-dark dark:text-white">
                Meal Items
              </p>
              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                Add ingredients or food entries for this meal.
              </p>
            </div>

            {!readOnly && (
              <Button
                type="button"
                variant="outlinePrimary"
                label="+ Add Item"
                onClick={() =>
                  append(createDefaultMealItem({ order_index: items.length }))
                }
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold"
              />
            )}
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-stroke/70 bg-white/60 p-5 text-center dark:border-dark-3 dark:bg-dark/30">
                <p className="text-sm font-medium text-dark dark:text-white">
                  No items yet
                </p>
                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Add the first food item for this meal.
                </p>
              </div>
            ) : (
              items.map((item, itemIndex) => (
                <DietMealItemRow
                  key={item.fieldId}
                  mealIndex={index}
                  itemIndex={itemIndex}
                  item={item}
                  onRemove={() => remove(itemIndex)}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>

          {typeof mealErrors?.items?.message === "string" && (
            <p className="mt-3 text-sm text-red-500 dark:text-red-400">
              {mealErrors.items.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}