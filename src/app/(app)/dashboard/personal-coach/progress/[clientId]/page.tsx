import { notFound } from "next/navigation";
import { PersonalCoachClientProgressView } from "@/components/Dashboard/personal-coach/client-progress-view";
import {
  getPersonalCoachDietPlans,
  getPersonalCoachProgressOverview,
  getPersonalCoachTrainingPlans,
} from "@/services/coach-schema.services";

type PageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function PersonalCoachClientProgressPage({
  params,
}: PageProps) {
  const { clientId } = await params;
  const [progress, dietPlans, trainingPlans] = await Promise.all([
    getPersonalCoachProgressOverview(clientId),
    getPersonalCoachDietPlans(clientId),
    getPersonalCoachTrainingPlans(clientId),
  ]);

  if (!progress.client) {
    notFound();
  }

  return (
    <PersonalCoachClientProgressView
      clientId={clientId}
      client={progress.client}
      summaryCards={progress.summaryCards}
      series={progress.series}
      records={progress.records}
      initialDietPlans={dietPlans}
      initialTrainingPlans={trainingPlans}
    />
  );
}
