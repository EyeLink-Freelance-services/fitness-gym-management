"use client";

import Link from "next/link";
import { FileText, Pencil, Clock3, UtensilsCrossed } from "lucide-react";

export type DietPlanListRow = {
  id: string;
  title: string;
  description?: string | null;
  status: "draft" | "published" | "archived";
  created_at?: string;
  meals_count?: number;
};

type Props = {
  plans: DietPlanListRow[];
};

function getStatusClasses(status: DietPlanListRow["status"]) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20";
    case "archived":
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
    case "draft":
    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20";
  }
}

function formatDate(date?: string) {
  if (!date) return null;

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return null;
  }
}

export default function DietPlansList({ plans }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Diet plans
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and organize your nutrition programs.
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {plans.length} {plans.length === 1 ? "plan" : "plans"}
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <FileText className="h-7 w-7 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No diet plans yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Start by creating your first diet plan to organize meals, goals, and
            nutritional guidance.
          </p>
        </div>
      ) : (
        <div className="p-3">
          <div className="space-y-3">
            {plans.map((plan) => {
              const formattedDate = formatDate(plan.created_at);

              return (
                <div
                  key={plan.id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                          {plan.title}
                        </h2>

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                            plan.status
                          )}`}
                        >
                          {plan.status}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {plan.description || "No description provided for this diet plan."}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                          {plan.meals_count ?? 0} meals
                        </span>

                        {formattedDate && (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" />
                            Created {formattedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <Link
                        href={`/diet-plans/${plan.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        View
                      </Link>

                      <Link
                        href={`/diet-plans/${plan.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}