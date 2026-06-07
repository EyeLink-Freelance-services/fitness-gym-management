"use client";

import { useEffect, useMemo, useState } from "react";
import { coachDietPlanColumns, coachTrainingPlanColumns } from "@/components/Dashboard/table-column/personal-coach-plan-columns";
import PersonalCoachDietPlanForm from "@/components/Forms/PersonalCoachDietPlanForm";
import PersonalCoachTrainingPlanForm from "@/components/Forms/PersonalCoachTrainingPlanForm";
import { DataTable } from "@/components/Tables";
import {
  toDietFormData,
  toDietRecord,
  toDietRow,
  toTrainingFormData,
  toTrainingRecord,
  toTrainingRow,
} from "@/modules/client-records/coach-plan.mappers";
import type { ActivePlanDialog, CoachPlanClient } from "@/modules/client-records/coach-plan.types";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import type {
  PersonalCoachDietPlanFormData,
  PersonalCoachTrainingPlanFormData,
} from "@/types/forms";

type CoachPlansSectionProps = {
  client: CoachPlanClient;
  initialDietPlans: CoachDietPlanRecord[];
  initialTrainingPlans: CoachTrainingPlanRecord[];
  activeDialog?: ActivePlanDialog;
  onActiveDialogChange?: (dialog: ActivePlanDialog) => void;
  onDietPlanSave?: (record: CoachDietPlanRecord) => Promise<void> | void;
  onTrainingPlanSave?: (record: CoachTrainingPlanRecord) => Promise<void> | void;
};

export function CoachPlansSection({
  client,
  initialDietPlans,
  initialTrainingPlans,
  activeDialog: controlledDialog,
  onActiveDialogChange,
  onDietPlanSave,
  onTrainingPlanSave,
}: CoachPlansSectionProps) {
  const [dietPlans, setDietPlans] = useState(initialDietPlans);
  const [trainingPlans, setTrainingPlans] = useState(initialTrainingPlans);
  const [internalDialog, setInternalDialog] = useState<ActivePlanDialog>(null);

  const activeDialog = controlledDialog !== undefined ? controlledDialog : internalDialog;

  const setActiveDialog = (dialog: ActivePlanDialog) => {
    if (onActiveDialogChange) {
      onActiveDialogChange(dialog);
      return;
    }
    setInternalDialog(dialog);
  };

  useEffect(() => {
    setDietPlans(initialDietPlans);
  }, [initialDietPlans]);

  useEffect(() => {
    setTrainingPlans(initialTrainingPlans);
  }, [initialTrainingPlans]);

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDialog(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeDialog]);

  const dietRows = useMemo(() => dietPlans.map(toDietRow), [dietPlans]);
  const trainingRows = useMemo(
    () => trainingPlans.map(toTrainingRow),
    [trainingPlans],
  );

  const selectedDietPlan =
    activeDialog?.type === "diet" && activeDialog.planId
      ? dietPlans.find((plan) => plan.id === activeDialog.planId)
      : undefined;

  const selectedTrainingPlan =
    activeDialog?.type === "training" && activeDialog.planId
      ? trainingPlans.find((plan) => plan.id === activeDialog.planId)
      : undefined;

  const upsertDietPlan = (nextRecord: CoachDietPlanRecord) => {
    setDietPlans((current) => {
      const withoutCurrent = current.filter((plan) => plan.id !== nextRecord.id);
      return [nextRecord, ...withoutCurrent];
    });
  };

  const upsertTrainingPlan = (nextRecord: CoachTrainingPlanRecord) => {
    setTrainingPlans((current) => {
      const withoutCurrent = current.filter((plan) => plan.id !== nextRecord.id);
      return [nextRecord, ...withoutCurrent];
    });
  };

  const handleDietSubmit = async (values: PersonalCoachDietPlanFormData) => {
    const nextRecord = toDietRecord(values, selectedDietPlan?.id);

    try {
      if (onDietPlanSave) {
        await onDietPlanSave(nextRecord);
      }

      upsertDietPlan(nextRecord);
      setActiveDialog(null);
    } catch {
      // Keep the dialog open when persistence fails.
    }
  };

  const handleTrainingSubmit = async (
    values: PersonalCoachTrainingPlanFormData,
  ) => {
    const nextRecord = toTrainingRecord(values, selectedTrainingPlan?.id);

    try {
      if (onTrainingPlanSave) {
        await onTrainingPlanSave(nextRecord);
      }

      upsertTrainingPlan(nextRecord);
      setActiveDialog(null);
    } catch {
      // Keep the dialog open when persistence fails.
    }
  };

  return (
    <>
      <div className="grid gap-6">
        <DataTable
          title="Diet Plans"
          description="Click a row to review or update the client's meal plan."
          data={dietRows}
          columns={coachDietPlanColumns}
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            setActiveDialog({ type: "diet", mode: "edit", planId: row.id })
          }
          emptyStateLabel="No diet plan has been created for this client yet."
          searchPlaceholder="Search diet plans..."
          tableClassName="min-w-[760px]"
        />

        <DataTable
          title="Training Plans"
          description="Click a row to review or update the client's weekly training split."
          data={trainingRows}
          columns={coachTrainingPlanColumns}
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            setActiveDialog({
              type: "training",
              mode: "edit",
              planId: row.id,
            })
          }
          emptyStateLabel="No training plan has been created for this client yet."
          searchPlaceholder="Search training plans..."
          tableClassName="min-w-[1240px]"
        />
      </div>

      {activeDialog && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveDialog(null);
            }
          }}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
            <div className="max-h-[85vh] overflow-y-auto p-4">
              {activeDialog.type === "diet" ? (
                <PersonalCoachDietPlanForm
                  mode={activeDialog.mode}
                  initialData={toDietFormData(client, selectedDietPlan)}
                  onCancel={() => setActiveDialog(null)}
                  onSubmit={handleDietSubmit}
                />
              ) : (
                <PersonalCoachTrainingPlanForm
                  mode={activeDialog.mode}
                  initialData={toTrainingFormData(client, selectedTrainingPlan)}
                  onCancel={() => setActiveDialog(null)}
                  onSubmit={handleTrainingSubmit}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
