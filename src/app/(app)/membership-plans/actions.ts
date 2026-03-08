"use server"

import { createMembershipPlan, listMembershipPlan, updateMembershipPlan } from "@/lib/db/queries/membership-plan";
import { MembershipPlanCreateInput, MembershipPlanEditInput, MembershipPlanEditSchema, MembershipPlanFormSchema, MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import { revalidatePath } from "next/cache";

export async function listMembershipPlanAction() {

	try {
		const membershipPlan: MembershipPlanRow[] = await listMembershipPlan();

		return {
				ok: true,
				data: membershipPlan
		};

	} catch (error: any) {
		return {
				ok: false,
				message: error.message ?? 'failed to list membership plan'
		}
	}
}

export async function createMembershipPlanAction(values: MembershipPlanCreateInput) {
	const parsed = MembershipPlanFormSchema.safeParse(values);

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.flatten(),
			message: 'Invalid payload'
		};
	}

	const payload = {
		...parsed.data,
		features: parsed.data.features?.map((f) => f.value).filter(Boolean) ?? [],
	};

	try {
		const membershipPlan = await createMembershipPlan(payload);
		revalidatePath('/membership-plans')

		return {
				ok: true,
				data: membershipPlan
		};
	} catch (error: any) {
		return {
				ok: false,
				message: error.message ?? 'failed to create member'
		}
	}
}

export async function updateMembershipPlanAction(values: MembershipPlanEditInput) {
	const parsed = MembershipPlanEditSchema.safeParse(values);

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.flatten(),
			message: 'Invalid payload'
		};
	}

	try {
		const membershipPlan = await updateMembershipPlan(parsed.data);
		revalidatePath('/membership-plans')

		return {
				ok: true,
				data: membershipPlan
		};
	} catch (error: any) {
		return {
				ok: false,
				message: error.message ?? 'failed to update member'
		}
	}
}