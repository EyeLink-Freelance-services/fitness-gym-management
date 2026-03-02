"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";
import { ROUTES } from "@/constants/route";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <LoginForm
          onForgotPassword={() => router.push(ROUTES.FORGOT_PASSWORD)}
        />
      </div>
    </div>
  );
}
