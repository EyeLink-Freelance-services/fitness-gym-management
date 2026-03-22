
import Link from "next/link";
import Header from "@/components/FormElements/common/header";
import { listDietPlanAction } from "./actions";
import DietPlansList from "./components/diet-plan-list";
import { ROUTES } from "@/constants/route";
import { Button } from "@/components/ui-elements/button";

export default async function DietPlansPage() {
  const res = await listDietPlanAction();

  const plans = res?.data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 p-4  lg:p-6">
      
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Header
          label="- Overview"
          title="Diet Plans"
          subtitle="Manage diet programs"
        />

        <Link href={ROUTES.DIET_PLANS.NEW_TEMPLATES}>
          <Button
            label='Create Diet Plan'
          />
        </Link>
      </div>

      <DietPlansList plans={plans} />
    </div>
  );
}