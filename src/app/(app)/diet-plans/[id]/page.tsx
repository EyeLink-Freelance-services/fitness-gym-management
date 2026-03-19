import { getDietPlanAction } from "../actions";
import DietPlanBuilder from "../components/diet-plan-builder";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DietPlanDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const plan  = await getDietPlanAction(id);
  console.log(plan, 'plan')

  return (
    <DietPlanBuilder
      initialValues={plan.data}
      readOnly
    />
  );
}