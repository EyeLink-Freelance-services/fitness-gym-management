"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { createDefaultMeal } from "../helpers/default-values";
import DietMealCard from "./diet-meal-card";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import SectionHeader from "@/components/ui/section-header";
import { useStickyCompact } from "@/hooks/use-sticky-compact";
import DietDayStickyHeader from "./diet-day-sticky-header";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const values = watch("meals") ?? [];

  const isMobile = useIsMobile();

  function getNextDayIndex() {
    if (values.length === 0) return 1;
    return Math.max(...values.map((meal) => Number(meal?.day_index) || 1)) + 1;
  }

  function handleAddDay() {
    append(
      createDefaultMeal({
        day_index: getNextDayIndex(),
        order_index: meals.length,
      })
    );
  }

  function handleAddMealForDay(dayIndex: number) {
    const dayMealsCount = values.filter(
      (meal) => Number(meal?.day_index) === dayIndex
    ).length;

    append(
      createDefaultMeal({
        day_index: dayIndex,
        order_index: dayMealsCount,
      })
    );
  }

  const groupedMeals = meals.reduce((acc, meal, index) => {
    const day = Number(values[index]?.day_index) || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ field: meal, index });
    return acc;
  }, {} as Record<number, { field: typeof meals[number]; index: number }[]>);

  const sortedDays = Object.keys(groupedMeals)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="overflow-visible rounded-[24px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
      <div className={`sticky lg:top-27 top-22 z-20 overflow-hidden rounded-[24px] bg-white/90 backdrop-blur-md dark:bg-dark-2/90`}>
        <SectionHeader
          badge="Meal Planner"
          title="Meals by Day"
          description="Organize meals by day and add entries such as breakfast, lunch, dinner, or snacks."
          rightContent={
            !readOnly ? (
              <Button
                type="button"
                variant="outlinePrimary"
                label={`${isMobile ? '+' : '+ Add day' }`}
                onClick={handleAddDay}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold"
              />
            ) : null
          }
        />
      </div>

      <div className="p-5 md:p-6">
        {meals.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-dashed border-stroke/70 bg-white/50 p-8 text-center dark:border-dark-3 dark:bg-dark/40">
            <div>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                🍽️
              </div>

              <h3 className="text-base font-semibold text-dark dark:text-white">
                No meal days yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
                Start by creating the first day for this diet plan.
              </p>

              {!readOnly && (
                <div className="mt-5">
                  <Button
                    type="button"
                    label="Create first day"
                    onClick={handleAddDay}
                    className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedDays.map((day) => {
              const dayMeals = groupedMeals[day];

              return (
                <section
                  key={day}
                  className="overflow-visible rounded-[22px] bg-white/50 dark:bg-dark/40"
                >
                  <DietDayStickyHeader
                    day={day}
                    readOnly={readOnly}
                    onAddMeal={() => handleAddMealForDay(day)}
                  />
                  <div className="space-y-4 p-4">
                    {dayMeals.map(({ field, index }) => (
                      <DietMealCard
                        key={field.fieldId}
                        index={index}
                        dayIndex={day}
                        onRemove={() => remove(index)}
                        readOnly={readOnly}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}