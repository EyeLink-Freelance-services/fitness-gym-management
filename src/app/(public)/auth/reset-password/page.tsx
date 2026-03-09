"use client";

import RecoveryForm from "@/components/Forms/RecoveryForm";
import { RECOVERY } from "@/constants/recovery";
import { ROUTES } from "@/constants/route";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <RecoveryForm step={RECOVERY.RESET_PASSWORD} onBackToLogin={() => router.push(ROUTES.LOGIN)} />
      </div>
    </div>
  )
}