"use client";

import Link from "next/link";

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

export default function DietPlansList({ plans }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h1 className="text-lg font-semibold">Diet plans</h1>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="font-medium">{plan.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {plan.description || "No description"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize dark:bg-slate-800">
                {plan.status}
              </span>

              <Link
                href={`/diet-plans/${plan.id}`}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
              >
                View
              </Link>

              <Link
                href={`/diet-plans/${plan.id}/edit`}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}