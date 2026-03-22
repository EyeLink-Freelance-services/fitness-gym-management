import { getDietPlanAction, saveDietPlanAction } from "../../actions";
import DietPlanClient from "../../components/diet-plan-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDietPlanPage({ params }: PageProps) {
  const { id } = await params;
  const plan = await getDietPlanAction(id);

  return (
    <DietPlanClient 
      initialPlan={plan.data} 
      title="Edit Diet Plan"
      onSubmit={saveDietPlanAction}
    />
  );
}