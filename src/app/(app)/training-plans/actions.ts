"use server"

import { createTrainingPlan, getTrainingPlan, listTrainingPlan, saveTrainingPlan } from "@/lib/db/queries/training-plans";
import { TrainingPlanFormInput, TrainingPlanFormSchema } from "@/lib/validation/schemas/training-plans";
import { TrainingPlan } from "@/types/training-plan";
import { revalidatePath } from "next/cache";

export async function getTrainingPlanAction(id: string) {
	try {
		const trainingPlan: TrainingPlanFormInput= await getTrainingPlan(id);

		return {
				ok: true,
				data: trainingPlan
		};

	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to list training plan'
		}
	}
}

export async function saveTrainingPlanAction(values: TrainingPlanFormInput) {
	const parsed = TrainingPlanFormSchema.safeParse(values);

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.flatten(),
			message: 'Invalid payload'
		};
	}

	try {
		const trainingPlan: string = await saveTrainingPlan(parsed.data);
		console.log(trainingPlan, 'trainingPlan');
		revalidatePath('/training-plans');

		return {
			ok: true,
			data: trainingPlan
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to create training plan'
		}
	}
}


export async function listTrainingPlanAction() {

	try {
		const trainingPlan: TrainingPlan[] = await listTrainingPlan();

		return {
				ok: true,
				data: trainingPlan
		};

	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to list training plan'
		}
	}
}

export async function createTrainingPlanAction(values: TrainingPlanFormInput) {
	const parsed = TrainingPlanFormSchema.safeParse(values);

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.flatten(),
			message: 'Invalid payload'
		};
	}

	try {
		const trainingPlan: any = await createTrainingPlan(parsed.data);
		console.log(trainingPlan, 'trainingPlan');
		revalidatePath('/training-plans');

		return {
			ok: true,
			data: trainingPlan
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to create training plan'
		}
	}
}

// export async function updateMembershipPlanAction(values: MembershipPlanEditInput) {
//     console.log(values)
//     const parsed = MembershipPlanEditSchema.safeParse(values);

//     if (!parsed.success) {
//         return {
//             ok: false,
//             errors: parsed.error.flatten(),
//             message: 'Invalid payload'
//         };
//     }

//     try {
//         const membershipPlan = await updateMembershipPlan(parsed.data);
//         revalidatePath('/membership-plans')

//         return {
//                 ok: true,
//                 data: membershipPlan
//         };
//     } catch (error: any) {
//         return {
//                 ok: false,
//                 message: error.message ?? 'failed to update member'
//         }
//     }
// }