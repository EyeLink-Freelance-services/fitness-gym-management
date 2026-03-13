"use client";

import { TrainingPlan } from "@/types/training-plan";
import { useRouter } from "next/navigation";
import TrainingPlanRow from "./training-plan-row";
import { ROUTES } from "@/constants/route";

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
            Create and manage workout programs
          </p>
        </div>

        <button
          onClick={() => router.push(ROUTES.TRAINING_PLANS.NEW_TEMPLATES)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Create Plan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">

          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans.map(plan => (
              <TrainingPlanRow key={plan.id} plan={plan}/>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}