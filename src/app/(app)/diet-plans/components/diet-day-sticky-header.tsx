"use client";

import { Button } from "@/components/ui-elements/button";
import { useStickyCompact } from "@/hooks/use-sticky-compact";

type Props = {
  day: number;
  readOnly?: boolean;
  onAddMeal: () => void;
};

export default function DietDayStickyHeader({
  day,
  readOnly,
  onAddMeal,
}: Props) {
  const { sentinelRef, isCompact } = useStickyCompact({
    rootMargin: "-168px 0px 0px 0px",
  });

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" />

      <div className={`${isCompact ? 'rounded-[24px] w-80 ml-[-10px]' : 'rounded-t-[24px]'} sticky top-48 z-30  bg-white/90 px-4 backdrop-blur-sm transition-all duration-200 dark:bg-dark-2/90`}>
        {isCompact ? (
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Day {day}
            </div>

            {!readOnly && (
              <Button
                type="button"
                variant="outlinePrimary"
                label="+ Add Meal"
                size="xs"
                onClick={onAddMeal}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Day {day}
              </div>

              <h3 className="mt-3 text-lg font-semibold text-dark dark:text-white">
                Meal Schedule
              </h3>

              <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                Manage meals planned for day {day}.
              </p>
            </div>

            {!readOnly && (
              <Button
                type="button"
                variant="outlinePrimary"
                label="+ Add Meal"
                onClick={onAddMeal}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}