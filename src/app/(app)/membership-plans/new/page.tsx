"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MembershipPlanCreateInput, MembershipPlanFormSchema } from "@/lib/validation/schemas/membership-plan";
import { Button } from "@/components/ui/form";
import MembershipPlanForm, { MembershipPlanFormValues } from "../components/membership-plan-form";
import { ROUTES } from "@/constants/route";
import { useState } from "react";
import { createMembershipPlanAction } from "../actions";
import { useCompany } from "@/app/context/company-context";
import Link from "next/link";
import { ArrowLeftIcon } from "@/assets/icons";


export default function CreateMembershipPlanForm() {
	const company = useCompany()
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const form = useForm<MembershipPlanCreateInput>({
    resolver: zodResolver(MembershipPlanFormSchema),
    defaultValues: {
      company_id: company.company_id,
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
		console.log('lol', values)

    const res = await createMembershipPlanAction(values);
    
    if(!res.ok) {
    	setErrorMsg(res.message)
    } else {
    	router.push(`${ROUTES.MEMBERSHIP.ID(res.data.id)}`);
    }
	};

  return (
    <form onSubmit={form.handleSubmit(
    onSubmit)} className="grid gap-6">
			<Link href={ROUTES.MEMBERSHIP.LIST_MEMBERSHIP}>
        <ArrowLeftIcon className="cursor-pointer" />
      </Link>
      <MembershipPlanForm form={form as unknown as UseFormReturn<MembershipPlanFormValues>} />
			
			{errorMsg && (
				<div className="mb-2 text-sm text-red-600">{errorMsg}</div>
			)}

      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Create plan"}
        </Button>
      </div>
    </form>
  );
}