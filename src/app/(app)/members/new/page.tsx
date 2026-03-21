"use client";

import ClientForm from "@/components/Forms/ClientForm";
import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import { useRouter } from "next/navigation";

export default function NewMemberPage() {
  const router = useRouter();

  return (
    <div className="max-w-full">
      <ArrowLeftIcon
        onClick={() => router.back()}
        className="mb-5 cursor-pointer"
      />
      <ClientForm />
    </div>
  );
}
