import { PersonalCoachDietPlan } from "@/components/Dashboard/personal-coach/diet-plan";
import { listDietPlanAction } from "@/app/(app)/diet-plans/actions";

export default async function PersonalCoachDietPlanPage() {
  const res = await listDietPlanAction();
  const plans = res?.data ?? [];

  return <PersonalCoachDietPlan plans={plans} />;
}
