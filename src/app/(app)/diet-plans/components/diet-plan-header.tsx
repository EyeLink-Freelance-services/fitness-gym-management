"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui-elements/button";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { DietPlanStatus } from "@/types/diet-plan";

type Props = {
  loading?: boolean;
  readOnly?: boolean;
};

const statusStyles: Record<DietPlanStatus, string> = {
  draft:
    "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
  published:
    "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  archived:
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20",
};

const statusText: Record<DietPlanStatus, string> = {
  draft: "Still in progress",
  published: "Ready to use",
  archived: "Stored for later",
};

export default function DietPlanHeader({ loading, readOnly }: Props) {
  const { watch } = useFormContext<DietPlanFormInput>();
  const title = watch("title");
  const status = watch("status") as DietPlanStatus;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Diet Plan
            </div>

            <h1 className="truncate text-xl font-semibold tracking-tight text-dark dark:text-white md:text-2xl">
              {title?.trim() || "Untitled diet plan"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
              Manage the structure, meals, and publishing status of this diet plan.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:min-w-[280px]">
            <div className="rounded-2xl border border-stroke/70 bg-white/80 px-4 py-4 dark:border-dark-3 dark:bg-dark">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
                Current status
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${statusStyles[status]}`}
                >
                  {status}
                </span>

                <p className="text-sm font-medium text-dark dark:text-white">
                  {statusText[status]}
                </p>
              </div>
            </div>

            {!readOnly && (
              <Button
                type="submit"
                disabled={loading}
                label={loading ? "Saving..." : "Save Diet Plan"}
                className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}