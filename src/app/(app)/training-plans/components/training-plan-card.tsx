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
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100";
    }
  }

  return (
    <div className="border rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between">

      {/* Top */}
      <div>
        <h3 className="font-semibold text-lg mb-1">
          {plan.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${getStatusStyle(plan.status)}`}
        >
          {plan.status}
        </span>

        <p className="text-sm text-gray-500 mt-3">
          {plan.description ?? "No description"}
        </p>
      </div>

      {/* Meta */}
      <div className="mt-4 text-xs text-gray-500">
        Created {new Date(plan.created_at).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={() =>
            router.push(ROUTES.TRAINING_PLANS.ID(plan.id))
          }
          className="text-blue-600 text-sm hover:underline"
        >
          Edit
        </button>

        <button
          className="text-gray-700 text-sm hover:underline"
        >
          Duplicate
        </button>

      </div>

    </div>
  );
}