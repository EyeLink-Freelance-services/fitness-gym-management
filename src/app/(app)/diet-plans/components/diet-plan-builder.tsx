"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DietPlanFormInput, DietPlanFormSchema, DietPlanFormValues } from "@/lib/validation/schemas/diet-plans";
import DietPlanHeader from "./diet-plan-header";
import DietPlanGeneralSection from "./diet-plan-general-section";
import DietPlanMealsSection from "./diet-plan-meals-section";

type Props = {
  initialValues?: DietPlanFormInput;
  onSubmit?: (values: DietPlanFormValues) => Promise<any> | void;
  loading?: boolean;
  readOnly?: boolean;
};

export default function DietPlanBuilder({
  initialValues,
  onSubmit,
  loading,
  readOnly = false,
}: Props) {
  const methods = useForm<DietPlanFormInput, unknown, DietPlanFormValues>({
    resolver: zodResolver(DietPlanFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
    async (values) => {
      console.log("valid submit values", values);
      const result = await onSubmit?.(values);
      console.log("server result", result);
    },
    (errors) => {
      console.log("form errors", errors);
    }
  )}
        className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
          <DietPlanHeader
            loading={loading || isSubmitting}
            readOnly={readOnly}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <DietPlanGeneralSection readOnly={readOnly} />
            <DietPlanMealsSection readOnly={readOnly} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}