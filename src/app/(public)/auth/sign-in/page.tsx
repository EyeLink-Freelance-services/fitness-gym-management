"use client";

import { useRouter } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";
import { ROUTES } from "@/constants/route";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image
        src="/images/common/dark_bg.png"
        width={1420}
        height={90}
        className="absolute left-0 top-0 h-full w-full object-center opacity-30"
        alt=""
        role="presentation"
      />
      
      <div className="w-full max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
}
