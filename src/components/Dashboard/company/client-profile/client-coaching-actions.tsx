import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";

type ClientCoachingActionsProps = {
  clientId: string;
  onOpenDietPlan: () => void;
  onOpenTrainingPlan: () => void;
};

export function ClientCoachingActions({
  clientId,
  onOpenDietPlan,
  onOpenTrainingPlan,
}: ClientCoachingActionsProps) {
  return (
    <>
      <Button
        label="Edit Diet Plan"
        variant="outlineDark"
        size="small"
        onClick={onOpenDietPlan}
      />
      <Button
        label="Edit Training Plan"
        variant="outlineDark"
        size="small"
        onClick={onOpenTrainingPlan}
      />
      <Link href={`${ROUTES.DASHBOARD.COMPANY.DATA_ENTRY}?clientId=${clientId}`}>
        <Button label="Data Entry" size="small" />
      </Link>
    </>
  );
}

export function createDietPlanDialog(): ActivePlanDialog {
  return { type: "diet", mode: "create" };
}

export function createTrainingPlanDialog(): ActivePlanDialog {
  return { type: "training", mode: "create" };
}
