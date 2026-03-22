import { getDietPlanAction } from "../actions";
import DietPlanClient from "../components/diet-plan-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DietPlanDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const plan  = await getDietPlanAction(id);
  console.log(plan, 'plan')

  return (
    <DietPlanClient 
      title="Diet Plan"
      initialPlan={plan.data} 
      readOnly 
    />
  );
}