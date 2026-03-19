'use client'

import { useCompany } from "@/app/context/company-context";

import DietPlanBuilder from "../components/diet-plan-builder";
import { createDefaultDietPlan } from "../helpers/default-values";
import { saveDietPlanAction } from "../actions";

export default function NewDietPlanPage() {
	const company = useCompany();

  return (
    <DietPlanBuilder
      initialValues={createDefaultDietPlan(company.id)}
      onSubmit={saveDietPlanAction}
    />
  );
}