import TrainingPlanBuilder from "../components/training-plan-builder";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ArrowLeftIcon } from "@/assets/icons";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import { getTrainingPlanAction } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const trainingPlan = await getTrainingPlanAction(id);

  return (
    <div>
      <Link href={ROUTES.TRAINING_PLANS.TEMPLATES}>
        <ArrowLeftIcon className="mb-2" />
      </Link>
      <Breadcrumb pageName="Training Plan" />
      <div className="min-h-screen bg-slate-50">
        <TrainingPlanBuilder initialPlan={trainingPlan.data} />
      </div>
    </div>
  );
}