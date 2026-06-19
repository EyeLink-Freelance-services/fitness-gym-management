"use client";

import RecoveryForm from "@/components/Forms/RecoveryForm";
import { ROUTES } from "@/constants/route";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const RECOVERY_RESET_PASSWORD = 2;
  const resetToken =
    searchParams.get("token") ??
    searchParams.get("code") ??
    searchParams.get("reset_token");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <RecoveryForm
          step={RECOVERY_RESET_PASSWORD}
          resetToken={resetToken}
          onBackToLogin={() => router.push(ROUTES.LOGIN)}
        />
      </div>
    </div>
  )
}