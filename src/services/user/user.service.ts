import { backendPut } from "@/lib/api/backend-client";

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await backendPut("/api/me/password", payload);
}
