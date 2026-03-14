"use client";

import { TrainingPlan } from "@/types/training-plan";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import TrainingPlanCard from "./training-plan-card";

type Props = {
  plans: TrainingPlan[];
};

export default function TrainingPlansList({ plans }: Props) {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Training Plans</h1>
          <p className="text-sm text-gray-500">
            Manage workout programs
          </p>
        </div>

        <button
          onClick={() => router.push(ROUTES.TRAINING_PLANS.NEW_TEMPLATES)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Create Plan
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <TrainingPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

    </div>
  );
}