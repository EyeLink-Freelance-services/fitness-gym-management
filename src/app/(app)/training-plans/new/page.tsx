'use client'

import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import TrainingPlanBuilder from "../components/training-plan-builder";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export default function NewTrainingPlanPage() {
	const router = useRouter();
	
	return (
		<div className="min-h-screen from-gray-50 via-white to-gray-100 dark:from-dark dark:via-dark dark:to-dark-2">
      <PageHeader 
				title="New Training Plan"
        description="Build sessions, exercises, and structure your workout plan"
			/>
      <div className="mx-auto w-full max-w-[2000px] px-4 pb-8 md:px-6 lg:px-0">
        <div className="overflow-hidden rounded-3xl border border-stroke/70 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <TrainingPlanBuilder />
        </div>
      </div>

    </div>
	);
}