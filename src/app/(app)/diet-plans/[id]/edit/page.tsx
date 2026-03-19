// import DietPlanBuilder from "@/features/diet-plans/components/diet-plan-builder";
// import { getDietPlanByIdAction, updateDietPlanAction } from "@/features/diet-plans/server/actions";
import { getDietPlanAction, saveDietPlanAction } from "../../actions";
import DietPlanBuilder from "../../components/diet-plan-builder";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDietPlanPage({ params }: PageProps) {
  const { id } = await params;
  const plan = await getDietPlanAction(id);

  return (
    <DietPlanBuilder
      initialValues={plan.data}
      onSubmit={saveDietPlanAction}
    />
  );
}