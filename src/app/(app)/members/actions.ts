"use server"

import { createMember } from "@/lib/db/queries/members";
import { MemberCreateInput, MemberCreateSchema } from "@/lib/validation/schemas/member";
import { revalidatePath } from "next/cache";

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