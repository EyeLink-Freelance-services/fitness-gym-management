import type { TrainingPlan } from "@/types/training-plan";

type PersonalCoachTrainingPlanProps = {
  plans?: TrainingPlan[];
};

export function PersonalCoachTrainingPlan({ plans }: PersonalCoachTrainingPlanProps) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {plans && plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-stroke p-4">
              <h3 className="font-semibold">{plan.title}</h3>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No training plans available</p>
        )}
      </div>
    </div>
  );
}
