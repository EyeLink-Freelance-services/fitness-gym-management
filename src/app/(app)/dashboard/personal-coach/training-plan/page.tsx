import { PersonalCoachTrainingPlan } from "@/components/Dashboard/personal-coach/training-plan";
import { listTrainingPlanAction } from "@/app/(app)/training-plans/actions";

export default async function PersonalCoachTrainingPlanPage() {
  const { data: plans } = await listTrainingPlanAction();

  return <PersonalCoachTrainingPlan plans={plans} />;
}
