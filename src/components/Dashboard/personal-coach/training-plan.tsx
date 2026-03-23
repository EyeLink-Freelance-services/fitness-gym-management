import TrainingPlansList from "@/app/(app)/training-plans/components/training-plan-list";
import type { TrainingPlan } from "@/types/training-plan";

type PersonalCoachTrainingPlanProps = {
  plans?: TrainingPlan[];
};

export function PersonalCoachTrainingPlan({ plans }: PersonalCoachTrainingPlanProps) {
  return (
    <div className="p-6">
      <TrainingPlansList plans={plans} />
    </div>
  );
}
