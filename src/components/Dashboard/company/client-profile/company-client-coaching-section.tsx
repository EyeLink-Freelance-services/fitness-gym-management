"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getDietSaveErrorMessage,
  validateDietMealsBeforeSave,
} from "@/modules/company/client-diet.mappers";
import {
  getTrainingSaveErrorMessage,
  validateTrainingBeforeSave,
} from "@/modules/company/client-training.mappers";
import {
  saveCompanyClientDietPlanAction,
  saveCompanyClientTrainingPlanAction,
} from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
import { CoachPlansSection } from "@/components/Dashboard/client-records/coach-plans-section";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";
import type {
  ClientDietPlanRow,
  ClientTrainingPlanRow,
  CoachDietPlanRecord,
} from "@/types/dashboard/client";
import type { CoachTrainingPlanFormData } from "@/types/forms";

type CompanyClientCoachingSectionProps = {
  clientId: string;
  clientName: string;
  initialDiets: ClientDietPlanRow[];
  initialTrainingPlans: ClientTrainingPlanRow[];
  activeDialog: ActivePlanDialog;
  onActiveDialogChange: (dialog: ActivePlanDialog) => void;
  readOnly?: boolean;
};

export function CompanyClientCoachingSection({
  clientId,
  clientName,
  initialDiets,
  initialTrainingPlans,
  activeDialog,
  onActiveDialogChange,
  readOnly = false,
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

  const handleTrainingPlanSave = async (
    values: CoachTrainingPlanFormData,
    trainingPlanId?: string,
  ) => {
    try {
      const validationError = validateTrainingBeforeSave(
        initialTrainingPlans,
        values,
        trainingPlanId,
      );

      if (validationError) {
        throw new Error(validationError);
      }

      await saveCompanyClientTrainingPlanAction(
        clientId,
        values,
        initialTrainingPlans,
        trainingPlanId,
      );
      toast.success("Training plan saved.");
      router.refresh();
    } catch (error) {
      toast.error(getTrainingSaveErrorMessage(error));
      throw error instanceof Error
        ? error
        : new Error(getTrainingSaveErrorMessage(error));
    }
  };

  return (
    <CoachPlansSection
      client={{ id: clientId, name: clientName }}
      initialDietPlans={[]}
      initialTrainingPlans={[]}
      activeDialog={activeDialog}
      onActiveDialogChange={onActiveDialogChange}
      onDietPlanSave={readOnly ? undefined : handleDietPlanSave}
      onTrainingPlanSave={readOnly ? undefined : handleTrainingPlanSave}
      serverDiets={{
        clientId,
        initialRows: initialDiets,
      }}
      serverTrainings={{
        clientId,
        initialRows: initialTrainingPlans,
      }}
      readOnly={readOnly}
    />
  );
}
