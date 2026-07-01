"use server";

import { changePassword } from "@/services/user/user.service";

export async function changePasswordAction(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    await changePassword(payload);
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not change password";
    return { ok: false as const, error: message };
  }
}
