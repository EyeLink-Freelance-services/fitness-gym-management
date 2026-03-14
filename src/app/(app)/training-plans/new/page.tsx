'use client'

import { TrainingPlanStatus } from "@/types/training-plan";
import TrainingPlanBuilder from "../components/training-plan-builder";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ArrowLeftIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";

function getTrainingPlan() {
	const id = '1';
	return {
		id,
		company_id: "company-1",
		created_by: "user-1",
		title: "Fat Loss Beginner Program",
		description: "A simple 3-day beginner plan focused on fat loss and consistency.",
		status: "draft" as TrainingPlanStatus,
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
	};
}


export default function NewTrainingPlanPage() {
	const router = useRouter();
	const initialPlan = getTrainingPlan();
	return (
		<div>
			<ArrowLeftIcon onClick={() => router.back()} className="mb-2 cursor-pointer" />
			<h2 className="text-[23px] font-bold mb-5 leading-[30px] text-dark dark:text-white">
				New Training Plan
			</h2>
			<div className="min-h-screen bg-slate-50">
				<TrainingPlanBuilder initialPlan={initialPlan} />
			</div>	
		</div>
	);
}