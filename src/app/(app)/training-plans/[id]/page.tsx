import { TrainingPlan } from "@/types/training-plan";
import TrainingPlanBuilder from "../components/training-plan-builder";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ArrowLeftIcon } from "@/assets/icons";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getTrainingPlan(id: string): Promise<TrainingPlanFormInput> {
  return {
    id,
    company_id: "company-1",
    created_by: "user-1",
    updated_by: null,
    title: "Fat Loss Beginner Program",
    description: "A simple 3-day beginner plan focused on fat loss and consistency.",
    level:1,
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sessions: [
      {
        id: "session-1",
        plan_id: id,
        day_index: 1,
        title: "Upper Body",
        notes: "Focus on controlled reps.",
        order_index: 0,
        exercises: [
          {
            id: "ex-1",
            session_id: "session-1",
            name: "Bench Press",
            sets: 4,
            reps: 10,
            weight: 60,
            rest_seconds: 90,
            tempo: "2-0-2",
            order_index: 0,
          },
          {
            id: "ex-2",
            session_id: "session-1",
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: 12,
            weight: 20,
            rest_seconds: 60,
            tempo: "2-1-2",
            order_index: 1,
          },
        ],
      },
      {
        id: "session-2",
        plan_id: id,
        day_index: 2,
        title: "Lower Body",
        notes: "Prioritize technique.",
        order_index: 1,
        exercises: [
          {
            id: "ex-3",
            session_id: "session-2",
            name: "Barbell Squat",
            sets: 4,
            reps: 8,
            weight: 80,
            rest_seconds: 120,
            tempo: "3-1-1",
            order_index: 0,
          },
        ],
      },
    ],
  } as TrainingPlanFormInput;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const trainingPlan = await getTrainingPlan(id);

  return (
    <div>
      <Link href={ROUTES.TRAINING_PLANS.TEMPLATES}>
        <ArrowLeftIcon className="mb-2" />
      </Link>
      <Breadcrumb pageName="Training Plan" />
      <div className="min-h-screen bg-slate-50">
        <TrainingPlanBuilder initialPlan={trainingPlan} />
      </div>
    </div>
  );
}