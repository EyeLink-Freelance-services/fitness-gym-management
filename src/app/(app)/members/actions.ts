"use server"

import { AssignmentType, getMembersForPlanAssignment } from "@/lib/db/queries/assign-members-coach";
import { getMembershipPlanByMemberIdAndCompanyId } from "@/lib/db/queries/member-membership";
import { createMember, createMemberWithMembershipPlan, listMembersByAssignCoach } from "@/lib/db/queries/members";
import { MemberCreateInput, MemberCreateSchema } from "@/lib/validation/schemas/member";
import { MemberMembershipCreateInput, MemberMembershipPlan, MemberMembershipTransactionSchema } from "@/lib/validation/schemas/member-membership";
import { revalidatePath } from "next/cache";

export async function getMembersByAssignCoach(idAssignCoachId: string, idCompany: string, search?: string) {
	try {
		const members: any = await listMembersByAssignCoach(idAssignCoachId, idCompany, search);

		return {
			ok: true,
			data: members
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to get member by assign coach'
		}
	}
}

export async function getMembersForPlanAssignmentAction(type: string, idAssignCoachId: string, idCompany: string, planId: string, search?: string) {
	try {
		const members: any = await getMembersForPlanAssignment(
			type as AssignmentType, 
			{
				companyId: idCompany,
    		assignedCoachId: idAssignCoachId,
    		planId: planId,
    		search: search,
			}
		);

		return {
			ok: true,
			data: members
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to get member by assign coach'
		}
	}
}

export async function getMembershipPlanAction(idMember: string, idCompany: string) {
  try {
		const membershipPlan: MemberMembershipPlan = await getMembershipPlanByMemberIdAndCompanyId(idMember, idCompany);

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

export async function createMemberAction(values: MemberCreateInput) {
	const parsed = MemberCreateSchema.safeParse(values);

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.flatten(),
			message: 'Invalid payload'
		};
	}

	try {
		const member = await createMember(parsed.data);
		revalidatePath('/members')

		return {
			ok: true,
			data: member
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to create member'
		}
	}
}

export async function createMemberWithMembershipPlanAction(valuesMember: MemberCreateInput, valuesMemberMembership: MemberMembershipCreateInput) {
  const parsedMember = MemberCreateSchema.safeParse(valuesMember);
  const parsedMemberMembershipPlan = MemberMembershipTransactionSchema.safeParse(valuesMemberMembership);

  if (!parsedMember.success) {
		return {
			ok: false,
			errors: parsedMember.error.flatten(),
			message: 'Invalid payload for Member'
		};
	}

  if (!parsedMemberMembershipPlan.success) {
		return {
			ok: false,
			errors: parsedMemberMembershipPlan.error.flatten(),
			message: 'Invalid payload for Member membership plan'
		};
	}

  try {
		const member = await createMemberWithMembershipPlan(parsedMember.data, parsedMemberMembershipPlan.data);
		revalidatePath('/members')

		return {
			ok: true,
			data: member
		};
	} catch (error: any) {
		return {
			ok: false,
			message: error.message ?? 'failed to create member'
		}
	}
}