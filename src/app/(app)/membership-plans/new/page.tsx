"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MembershipPlanCreateInput,
  MembershipPlanFormSchema,
} from "@/lib/validation/schemas/membership-plan";
import MembershipPlanForm, {
  MembershipPlanFormValues,
} from "../components/membership-plan-form";
import { ROUTES } from "@/constants/route";
import { useState } from "react";
import { createMembershipPlanAction } from "../actions";
import { useCompany } from "@/app/context/company-context";
import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import { ArrowLeftIcon } from "@/components/IconsCollection/icons";

export default function CreateMembershipPlanForm() {
  const company = useCompany();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<MembershipPlanCreateInput>({
    resolver: zodResolver(MembershipPlanFormSchema),
    defaultValues: {
      company_id: company.id,
      name: "",
      price: 0,
      entree_fee: 0,
      duration_days: 30,
      is_monthly: true,
      description: "",
      features: [],
      is_active: true,
    },
  });

  const onSubmit = async (values: MembershipPlanCreateInput) => {
    const res = await createMembershipPlanAction(values);

    if (!res.ok) {
      setErrorMsg(res.message);
    } else {
      router.push(`${ROUTES.MEMBERSHIP.ID(res.data.id)}`);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <Link
        href={ROUTES.MEMBERSHIP.LIST_MEMBERSHIP}
        className="text-gray-700 dark:text-gray-300"
      >
        <ArrowLeftIcon className="cursor-pointer" />
      </Link>

      <MembershipPlanForm
        form={form as unknown as UseFormReturn<MembershipPlanFormValues>}
      />

      {errorMsg && (
        <div className="mb-2 text-sm text-red-600 dark:text-red-400">{errorMsg}</div>
      )}

      <div className="flex justify-end">
        <Button
          label={form.formState.isSubmitting ? "Saving..." : "Create plan"}
          type="submit"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </form>
  );
}