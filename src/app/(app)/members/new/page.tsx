"use client";

import ClientForm from "@/components/Forms/ClientForm";
import { useEffect, useState, useTransition } from "react";
import MembershipPlansSelector from "../components/membership-plan-selection";
import { Button, buttonVariants } from "@/components/ui-elements/button";
import { Checkbox } from "@/components/FormElements/checkbox";
import { MemberCreateInput, MemberCreateSchema } from "@/lib/validation/schemas/member";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompany } from "@/app/context/company-context";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { createMember } from "@/lib/db/queries/members";
import { createMemberAction } from "../actions";
import { ArrowLeftIcon } from "@/assets/icons";

export default function NewMemberPage() {
  const { company_id } = useCompany();
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();

  const methods = useForm<MemberCreateInput>({
    mode: 'onChange',
    resolver: zodResolver(MemberCreateSchema),
    defaultValues: {
      company_id: company_id,
      assigned_coach_id: null,
      status: "active",
    },
  });

  const{ handleSubmit } = methods

  const onSubmit =  (values: MemberCreateInput) => {
    const payload = {
      ...values,
      assigned_coach_id: values.assigned_coach_id || null
    };
    
    startTransition(async () => {
      const res = await createMemberAction(payload);
      if(!res.ok) {
        setErrorMsg(res.message)
      } else {
        router.push(ROUTES.MEMBERS.ID(res.data.id))
      }
    });
  };

  return (
    <div className="max-w-full">
      <ArrowLeftIcon onClick={() => router.back()} className="mb-5 cursor-pointer" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ClientForm />
          <MembershipPlansSelector />
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
            <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
              Agreement
            </span>
            <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          </div>

          <div className="max-h-32 overflow-y-auto rounded-lg border border-stroke bg-gray-2 p-4 text-body-sm leading-relaxed text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
            The undersigned acknowledges that physical exercise involves inherent
            risks of injury. By registering as a member, I voluntarily assume
            these risks. I confirm that I am in adequate physical condition to
            participate in gym activities.
          </div>

          <div className="py-6">
            <Checkbox
              minimal
              radius="md"
              label={
                <span className="text-body-sm text-dark-5 dark:text-dark-6">
                  I confirm the member has read, understood, and accepted the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms &amp; Conditions
                  </a>
                  , and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAgreeTerms(e.target.checked)
              }
            />
          </div>
          {errorMsg && (
            <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
          )}
          <Button 
            type="submit" 
            disabled={!agreeTerms || isPending} 
            variant={!agreeTerms ? 'disabled' : 'primary'} 
            label={isPending ? "Saving..." : "Register Client"} 
            className={`w-full`} 
          />
        </form>
      </FormProvider>
    </div>
  );
}
