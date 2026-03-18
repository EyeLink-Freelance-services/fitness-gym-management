'use client'

import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import TrainingPlanBuilder from "../components/training-plan-builder";
import { useRouter } from "next/navigation";

export default function NewTrainingPlanPage() {
	const router = useRouter();
	
	return (
		<div>
			<ArrowLeftIcon onClick={() => router.back()} className="mb-2 cursor-pointer" />
			<h2 className="text-[23px] font-bold mb-5 leading-[30px] text-dark dark:text-white">
				New Training Plan
			</h2>
			<div className="min-h-screen bg-slate-50">
				<TrainingPlanBuilder />
			</div>	
		</div>
	);
}