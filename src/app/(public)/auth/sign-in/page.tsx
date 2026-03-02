"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <LoginForm
          onForgotPassword={() => router.push("/auth/forgot-password")}
        />
      </div>
    </div>
  );
}
