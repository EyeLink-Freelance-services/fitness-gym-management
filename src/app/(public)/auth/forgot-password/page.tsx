"use client";

import { useRouter } from "next/navigation";
import RecoveryForm from "@/components/Forms/RecoveryForm";
import { ROUTES } from "@/constants/route";
import { RECOVERY } from "@/constants/recovery";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <RecoveryForm step={RECOVERY.VERIFY_REGISTERED_EMAIL} onBackToLogin={() => router.push(ROUTES.LOGIN)} />
      </div>
    </div>
  );
}