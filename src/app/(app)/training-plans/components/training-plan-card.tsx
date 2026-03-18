"use client";

import { TrainingPlan } from "@/types/training-plan";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

type Props = {
  plan: TrainingPlan;
};

export default function TrainingPlanCard({ plan }: Props) {
  const router = useRouter();

  function getStatusStyle(status: string) {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-500/15 dark:text-green-400 dark:ring-green-500/20";
      case "draft":
        return "bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:ring-yellow-500/20";
      case "archived":
        return "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10";
      default:
        return "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10";
    }
  }

  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-stroke bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-dark dark:text-white">
              {plan.title}
            </h3>

            <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
              Created {new Date(plan.created_at).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyle(
              plan.status
            )}`}
          >
            {plan.status}
          </span>
        </div>

        <div className="mt-4">
          <p className="line-clamp-3 text-sm leading-6 text-dark-5 dark:text-dark-6">
            {plan.description?.trim() || "No description provided for this training plan."}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-stroke pt-4 dark:border-dark-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.TRAINING_PLANS.ID(plan.id))}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            View / Edit
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-white/5"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}