"use client";

import { TrainingPlan } from "@/types/training-plan";
import { useRouter } from "next/navigation";

type Props = {
  plan: TrainingPlan;
};

export default function TrainingPlanRow({ plan }: Props) {
  const router = useRouter();

  return (
    <tr className="border-t">

      <td className="px-4 py-3 font-medium">
        {plan.title}
      </td>

      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs rounded bg-gray-100">
          {plan.status}
        </span>
      </td>

      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(plan.created_at).toLocaleDateString()}
      </td>

      <td className="px-4 py-3 text-right space-x-2">

        <button
          onClick={() => router.push(`/training-plans/${plan.id}`)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>

      </td>

    </tr>
  );
}