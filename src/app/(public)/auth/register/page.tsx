"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/Forms/RegisterForm";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
