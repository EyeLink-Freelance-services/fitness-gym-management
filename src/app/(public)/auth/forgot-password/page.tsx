"use client";

import { useRouter } from "next/navigation";
import RecoveryForm from "@/components/Forms/RecoveryForm";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <RecoveryForm onBackToLogin={() => router.push("/auth/sign-in")} />
      </div>
    </div>
  );
}