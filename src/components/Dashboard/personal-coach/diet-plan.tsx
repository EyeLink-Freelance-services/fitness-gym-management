import Link from "next/link";
import Header from "@/components/FormElements/common/header";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import DietPlansList, {
  type DietPlanListRow,
} from "@/app/(app)/diet-plans/components/diet-plan-list";

type PersonalCoachDietPlanProps = {
  plans: DietPlanListRow[];
};

export function PersonalCoachDietPlan({ plans }: PersonalCoachDietPlanProps) {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Header
          label="- Overview"
          title="Diet Plans"
          subtitle="Manage diet programs"
        />

        <Link href={ROUTES.DIET_PLANS.NEW_TEMPLATES}>
          <Button label="Create Diet Plan" />
        </Link>
      </div>

      <DietPlansList plans={plans} />
    </div>
  );
}
