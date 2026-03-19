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
  draft: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  published: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  archived: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

export default function DietPlanHeader({ loading, readOnly }: Props) {
  const { watch } = useFormContext<DietPlanFormInput>();
  const title = watch("title");
  const status = watch("status");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {title?.trim() || "Untitled diet plan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status as DietPlanStatus]}`}>{status}</span>
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading} label={loading ? "Saving..." : "Save diet plan"}/>
          </div>
        )}
      </div>
    </div>
  );
}