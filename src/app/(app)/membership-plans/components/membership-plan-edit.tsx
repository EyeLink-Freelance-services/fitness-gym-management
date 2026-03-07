"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MembershipPlanEditInput, MembershipPlanEditSchema, MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import { Button } from "@/components/ui/form";
import MembershipPlanForm, { MembershipPlanFormValues } from "../components/membership-plan-form";
import { ROUTES } from "@/constants/route";
import { useState } from "react";
import { useCompany } from "@/app/context/company-context";
import { updateMembershipPlanAction } from "../actions";

type MembershipPlanProps = {
	plan: MembershipPlanRow
};

export default function EditMembershipPlanForm({plan}: MembershipPlanProps) {
	const company = useCompany()
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
	console.log(plan, 'plan');

  const form = useForm<MembershipPlanEditInput>({
    resolver: zodResolver(MembershipPlanEditSchema),
    defaultValues: {
			id: plan.id,
      company_id: company.company_id,
      name: plan.name,
			price: plan.price,
			entree_fee: plan.entree_fee,
			duration_days: plan.duration_days,
			is_monthly: plan.is_monthly,
			description: plan.description ?? "",
			is_active: plan.is_active,
			created_by: plan.created_by,
			updated_by: plan.updated_by,
		},
  });

  const onSubmit = async (values: MembershipPlanEditInput) => {
		console.log('lol')
    const res = await updateMembershipPlanAction(values);
    
    if(!res.ok) {
        setErrorMsg(res.message)
    } else {
        router.push(`${ROUTES.MEMBERSHIP.ID(res.data.id)}`);
    }
    };

  return (
    <form onSubmit={form.handleSubmit(
    onSubmit, (errors) => console.log('form errors', errors))} className="grid gap-6">
      <MembershipPlanForm form={form as unknown as UseFormReturn<MembershipPlanFormValues>} />
            
			{errorMsg && (
				<div className="mb-2 text-sm text-red-600">{errorMsg}</div>
			)}

      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Edit plan"}
        </Button>
      </div>
    </form>
  );
}