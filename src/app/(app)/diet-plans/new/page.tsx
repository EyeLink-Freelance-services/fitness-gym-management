'use client'

import { useCompany } from "@/app/context/company-context";

import DietPlanBuilder from "../components/diet-plan-builder";
import { createDefaultDietPlan } from "../helpers/default-values";
import { saveDietPlanAction } from "../actions";
import PageHeader from "@/components/PageHeader";

export default function NewDietPlanPage() {
	const company = useCompany();

  return (
    <>
      <PageHeader
        title="New Diet Plan"
        description="Structure your diet plan"
      />
      <DietPlanBuilder
        initialValues={createDefaultDietPlan(company.id)}
        onSubmit={saveDietPlanAction}
      />
    </>
  );
}