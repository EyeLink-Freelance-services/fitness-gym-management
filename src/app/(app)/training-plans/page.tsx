import { TrainingPlan } from "@/types/training-plan";
import TrainingPlansList from "./components/training-plan-list";

async function getPlans(): Promise<TrainingPlan[]> {
  return [
    {
      id: "plan-1",
      company_id: "company-1",
      created_by: "user-1",
      title: "Fat Loss Program",
      description: "Beginner fat loss plan",
      level: 1,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sessions: []
    },
    {
      id: "plan-2",
      company_id: "company-1",
      created_by: "user-1",
      title: "Strength Builder",
      description: "Intermediate strength plan",
      level: 1,
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sessions: []
    }
  ];
}

export default async function Page() {
  const plans = await getPlans();

  return (
    <div className="p-6">
      <TrainingPlansList plans={plans} />
    </div>
  );
}