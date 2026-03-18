import { TrainingPlan } from "@/types/training-plan";
import TrainingPlansList from "./components/training-plan-list";
import { listTrainingPlanAction } from "./actions";

export default async function Page() {
  const plans = await listTrainingPlanAction();

  return (
    <div className="p-6">
      <TrainingPlansList plans={plans.data} />
    </div>
  );
}