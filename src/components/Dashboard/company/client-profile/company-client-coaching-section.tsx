"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getDietSaveErrorMessage,
  validateDietMealsBeforeSave,
} from "@/modules/company/client-diet.mappers";
import {
  saveCompanyClientDietPlanAction,
  saveCompanyClientTrainingPlanAction,
} from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
import { CoachPlansSection } from "@/components/Dashboard/client-records/coach-plans-section";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";
import type {
  ClientDietPlanRow,
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";

type CompanyClientCoachingSectionProps = {
  clientId: string;
  clientName: string;
  initialDiets: ClientDietPlanRow[];
  initialTrainingPlans: CoachTrainingPlanRecord[];
  activeDialog: ActivePlanDialog;
  onActiveDialogChange: (dialog: ActivePlanDialog) => void;
};

export function CompanyClientCoachingSection({
  clientId,
  clientName,
  initialDiets,
  initialTrainingPlans,
  activeDialog,
  onActiveDialogChange,
}: CompanyClientCoachingSectionProps) {
  const router = useRouter();

  const handleDietPlanSave = async (
    record: CoachDietPlanRecord,
    dietId?: string,
  ) => {
    try {
      const validationError = validateDietMealsBeforeSave(
        initialDiets,
        record.meals,
        dietId,
      );

      if (validationError) {
        throw new Error(validationError);
      }

      await saveCompanyClientDietPlanAction(clientId, record, dietId);
      toast.success("Diet plan saved.");
      router.refresh();
    } catch (error) {
      toast.error(getDietSaveErrorMessage(error));
      throw error instanceof Error ? error : new Error(getDietSaveErrorMessage(error));
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
      initialDietPlans={[]}
      initialTrainingPlans={initialTrainingPlans}
      activeDialog={activeDialog}
      onActiveDialogChange={onActiveDialogChange}
      onDietPlanSave={handleDietPlanSave}
      onTrainingPlanSave={handleTrainingPlanSave}
      serverDiets={{
        clientId,
        initialRows: initialDiets,
      }}
    />
  );
}
