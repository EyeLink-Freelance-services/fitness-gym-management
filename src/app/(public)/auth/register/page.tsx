"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/Forms/RegisterForm";
import { Suspense } from "react";
import { SkeletonUI } from "@/components/ui/skeleton";

export default function SignUpPage() {

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Suspense fallback={<SkeletonUI />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
