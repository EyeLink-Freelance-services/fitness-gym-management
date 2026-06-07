"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveCompanyClientDietPlanAction,
  saveCompanyClientTrainingPlanAction,
} from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
import { CoachPlansSection } from "@/components/Dashboard/client-records/coach-plans-section";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";

type CompanyClientCoachingSectionProps = {
  clientId: string;
  clientName: string;
  initialDietPlans: CoachDietPlanRecord[];
  initialTrainingPlans: CoachTrainingPlanRecord[];
  activeDialog: ActivePlanDialog;
  onActiveDialogChange: (dialog: ActivePlanDialog) => void;
};

export function CompanyClientCoachingSection({
  clientId,
  clientName,
  initialDietPlans,
  initialTrainingPlans,
  activeDialog,
  onActiveDialogChange,
}: CompanyClientCoachingSectionProps) {
  const router = useRouter();

  const handleDietPlanSave = async (record: CoachDietPlanRecord) => {
    try {
      await saveCompanyClientDietPlanAction(clientId, record);
      toast.success("Diet plan saved.");
      router.refresh();
    } catch {
      toast.error("Unable to save diet plan.");
      throw new Error("Unable to save diet plan.");
    }
  };

  const handleTrainingPlanSave = async (record: CoachTrainingPlanRecord) => {
    try {
      await saveCompanyClientTrainingPlanAction(clientId, record);
      toast.success("Training plan saved.");
      router.refresh();
    } catch {
      toast.error("Unable to save training plan.");
      throw new Error("Unable to save training plan.");
    }
  };

  return (
    <CoachPlansSection
      client={{ id: clientId, name: clientName }}
      initialDietPlans={initialDietPlans}
      initialTrainingPlans={initialTrainingPlans}
      activeDialog={activeDialog}
      onActiveDialogChange={onActiveDialogChange}
      onDietPlanSave={handleDietPlanSave}
      onTrainingPlanSave={handleTrainingPlanSave}
    />
  );
}
