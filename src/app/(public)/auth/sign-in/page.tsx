"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";
import { ROUTES } from "@/constants/route";
import { Suspense } from "react";
import { SkeletonUI } from "@/components/ui/skeleton";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Suspense fallback={<SkeletonUI />}>
          <LoginForm
            onForgotPassword={() => router.push(ROUTES.FORGOT_PASSWORD)}
          />
        </Suspense>
      </div>
    </div>
  );
}
