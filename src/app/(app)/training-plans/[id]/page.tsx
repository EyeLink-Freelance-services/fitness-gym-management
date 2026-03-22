import { getTrainingPlanAction } from "../actions";

import TrainingPlanPageClient from "../components/training-page-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const trainingPlan = await getTrainingPlanAction(id);

  return (
    <TrainingPlanPageClient  initialPlan={trainingPlan.data}/>
  );
}