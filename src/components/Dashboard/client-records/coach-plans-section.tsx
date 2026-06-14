"use client";

import {
  clientDietPlanColumns,
  clientTrainingPlanColumns,
  coachDietPlanColumns,
  coachTrainingPlanColumns,
} from "@/components/Dashboard/table-column/personal-coach-plan-columns";

import PersonalCoachDietPlanForm from "@/components/Forms/PersonalCoachDietPlanForm";

import PersonalCoachTrainingPlanForm from "@/components/Forms/PersonalCoachTrainingPlanForm";

import { DataTable } from "@/components/Tables";

import { Button } from "@/components/ui-elements/button";

import {
  allDietSlotsTaken,
  createDietFormData,
  dietRowToFormData,
} from "@/modules/company/client-diet.mappers";

import {
  allTrainingDaysTaken,
  createTrainingFormData,
  getAvailableTrainingDays,
  trainingRowToFormData,
} from "@/modules/company/client-training.mappers";

import {
  toDietFormData,
  toDietRecord,
  toDietRow,
  toTrainingFormData,
  toTrainingRecord,
  toTrainingRow,
} from "@/modules/client-records/coach-plan.mappers";

import type {
  ActivePlanDialog,
  CoachPlanClient,
} from "@/modules/client-records/coach-plan.types";

import type {
  ClientDietPlanRow,
  ClientTrainingPlanRow,
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";

import type {
  PersonalCoachDietPlanFormData,
  PersonalCoachTrainingPlanFormData,
} from "@/types/forms";

import { useEffect, useMemo, useState } from "react";

type ServerDietsConfig = {
  clientId: string;

  initialRows: ClientDietPlanRow[];
};

type ServerTrainingsConfig = {
  clientId: string;

  initialRows: ClientTrainingPlanRow[];
};

type CoachPlansSectionProps = {
  client: CoachPlanClient;

  initialDietPlans: CoachDietPlanRecord[];

  initialTrainingPlans: CoachTrainingPlanRecord[];

  activeDialog?: ActivePlanDialog;

  onActiveDialogChange?: (dialog: ActivePlanDialog) => void;

  onDietPlanSave?: (
    record: CoachDietPlanRecord,

    dietId?: string,
  ) => Promise<void> | void;

  onTrainingPlanSave?: (
    values: PersonalCoachTrainingPlanFormData,

    trainingPlanId?: string,
  ) => Promise<void> | void;

  serverDiets?: ServerDietsConfig;

  serverTrainings?: ServerTrainingsConfig;

  readOnly?: boolean;
};

export function CoachPlansSection({
  client,

  initialDietPlans,

  initialTrainingPlans,

  activeDialog: controlledDialog,

  onActiveDialogChange,

  onDietPlanSave,

  onTrainingPlanSave,

  serverDiets,

  serverTrainings,

  readOnly = false,
}: CoachPlansSectionProps) {
  const [dietPlans, setDietPlans] = useState(initialDietPlans);

  const [trainingPlans, setTrainingPlans] = useState(initialTrainingPlans);

  const [internalDialog, setInternalDialog] = useState<ActivePlanDialog>(null);

  const activeDialog =
    controlledDialog !== undefined ? controlledDialog : internalDialog;

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

  const legacyDietRows = useMemo(() => dietPlans.map(toDietRow), [dietPlans]);

  const legacyTrainingRows = useMemo(
    () => trainingPlans.map(toTrainingRow),

    [trainingPlans],
  );

  const selectedDietPlan =
    activeDialog?.type === "diet" && activeDialog.planId && !serverDiets
      ? dietPlans.find((plan) => plan.id === activeDialog.planId)
      : undefined;

  const selectedDietRow =
    activeDialog?.type === "diet" && activeDialog.planId && serverDiets
      ? serverDiets.initialRows.find((row) => row.id === activeDialog.planId)
      : undefined;

  const selectedTrainingPlan =
    activeDialog?.type === "training" && activeDialog.planId && !serverTrainings
      ? trainingPlans.find((plan) => plan.id === activeDialog.planId)
      : undefined;

  const selectedTrainingRow =
    activeDialog?.type === "training" && activeDialog.planId && serverTrainings
      ? serverTrainings.initialRows.find(
          (row) => row.id === activeDialog.planId,
        )
      : undefined;

  const upsertDietPlan = (nextRecord: CoachDietPlanRecord) => {
    setDietPlans((current) => {
      const withoutCurrent = current.filter(
        (plan) => plan.id !== nextRecord.id,
      );

      return [nextRecord, ...withoutCurrent];
    });
  };

  const upsertTrainingPlan = (nextRecord: CoachTrainingPlanRecord) => {
    setTrainingPlans((current) => {
      const withoutCurrent = current.filter(
        (plan) => plan.id !== nextRecord.id,
      );

      return [nextRecord, ...withoutCurrent];
    });
  };

  const handleDietSubmit = async (values: PersonalCoachDietPlanFormData) => {
    const nextRecord = toDietRecord(values, selectedDietPlan?.id);

    const dietId =
      serverDiets &&
      activeDialog?.type === "diet" &&
      activeDialog.mode === "edit"
        ? activeDialog.planId
        : undefined;

    try {
      if (onDietPlanSave) {
        await onDietPlanSave(nextRecord, dietId);
      }

      if (!serverDiets) {
        upsertDietPlan(nextRecord);
      }

      setActiveDialog(null);
    } catch {
      // Keep the dialog open when persistence fails.
    }
  };

  const handleTrainingSubmit = async (
    values: PersonalCoachTrainingPlanFormData,
  ) => {
    const trainingPlanId =
      serverTrainings &&
      activeDialog?.type === "training" &&
      activeDialog.mode === "edit"
        ? activeDialog.planId
        : undefined;

    try {
      if (onTrainingPlanSave) {
        await onTrainingPlanSave(values, trainingPlanId);
      }

      if (!serverTrainings) {
        const nextRecord = toTrainingRecord(values, selectedTrainingPlan?.id);

        upsertTrainingPlan(nextRecord);
      }

      setActiveDialog(null);
    } catch {
      // Keep the dialog open when persistence fails.
    }
  };

  const isDietEdit =
    activeDialog?.type === "diet" && activeDialog.mode === "edit";

  const isTrainingEdit =
    activeDialog?.type === "training" && activeDialog.mode === "edit";

  const dietFormData = serverDiets
    ? isDietEdit
      ? dietRowToFormData(client, selectedDietRow)
      : createDietFormData(client, serverDiets.initialRows)
    : toDietFormData(client, selectedDietPlan);

  const trainingFormData = serverTrainings
    ? isTrainingEdit
      ? trainingRowToFormData(client, selectedTrainingRow)
      : createTrainingFormData(client)
    : toTrainingFormData(client, selectedTrainingPlan);

  const existingDietRowsForForm =
    serverDiets && isDietEdit && selectedDietRow
      ? serverDiets.initialRows.filter((row) => row.id !== selectedDietRow.id)
      : (serverDiets?.initialRows ?? []);

  const trainingVisibleDays = serverTrainings
    ? isTrainingEdit && selectedTrainingRow
      ? [selectedTrainingRow.day]
      : getAvailableTrainingDays(serverTrainings.initialRows)
    : undefined;

  const canAddDietPlan =
    !serverDiets || !allDietSlotsTaken(serverDiets.initialRows);

  const canAddTrainingPlan =
    !serverTrainings || !allTrainingDaysTaken(serverTrainings.initialRows);

  return (
    <>
      <div className="grid gap-6">
        {serverDiets ? (
          <DataTable
            title="Diet Plans"
            description={
              readOnly
                ? "Your assigned diet plans."
                : "Click a row to review or update the client's diet plan."
            }
            data={serverDiets.initialRows}
            columns={clientDietPlanColumns}
            getRowId={(row) => row.id}
            onRowClick={
              readOnly
                ? undefined
                : (row) =>
                    setActiveDialog({
                      type: "diet",
                      mode: "edit",
                      planId: row.id,
                    })
            }
            emptyStateLabel="No diet plans have been added for this client yet."
            headerActions={
              readOnly ? undefined : (
                <Button
                  type="button"
                  label="Add Diet"
                  disabled={!canAddDietPlan}
                  title={
                    canAddDietPlan
                      ? undefined
                      : "All meal slots are filled (Breakfast, Lunch, Dinner, Specific Time)."
                  }
                  onClick={() =>
                    setActiveDialog({ type: "diet", mode: "create" })
                  }
                />
              )
            }
            tableClassName="min-w-[640px]"
            showFooter={false}
          />
        ) : (
          <DataTable
            title="Diet Plans"
            description="Click a row to review or update the client's meal plan."
            data={legacyDietRows}
            columns={coachDietPlanColumns}
            getRowId={(row) => row.id}
            onRowClick={(row) =>
              setActiveDialog({
                type: "diet",

                mode: "edit",

                planId: row.id,
              })
            }
            emptyStateLabel="No diet plan has been created for this client yet."
            tableClassName="min-w-[760px]"
          />
        )}

        {serverTrainings ? (
          <DataTable
            title="Training Plans"
            description={
              readOnly
                ? "Your assigned training plans."
                : "Click a row to review or update the client's training plan."
            }
            data={serverTrainings.initialRows}
            columns={clientTrainingPlanColumns}
            getRowId={(row) => row.id}
            onRowClick={
              readOnly
                ? undefined
                : (row) =>
                    setActiveDialog({
                      type: "training",
                      mode: "edit",
                      planId: row.id,
                    })
            }
            emptyStateLabel="No training plans have been added for this client yet."
            headerActions={
              readOnly ? undefined : (
                <Button
                  type="button"
                  label="Add Plan"
                  disabled={!canAddTrainingPlan}
                  title={
                    canAddTrainingPlan
                      ? undefined
                      : "All days of the week already have a training plan."
                  }
                  onClick={() =>
                    setActiveDialog({ type: "training", mode: "create" })
                  }
                />
              )
            }
            tableClassName="min-w-[640px]"
            showFooter={false}
          />
        ) : (
          <DataTable
            title="Training Plans"
            description="Click a row to review or update the client's weekly training split."
            data={legacyTrainingRows}
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
            tableClassName="min-w-[1240px]"
          />
        )}
      </div>

      {activeDialog && !readOnly && (
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
                  initialData={dietFormData}
                  allowAddMeal={!serverDiets || activeDialog.mode === "create"}
                  allowRemoveMeal={
                    !serverDiets || activeDialog.mode === "create"
                  }
                  existingDietRows={existingDietRowsForForm}
                  onCancel={() => setActiveDialog(null)}
                  onSubmit={handleDietSubmit}
                />
              ) : (
                <PersonalCoachTrainingPlanForm
                  mode={activeDialog.mode}
                  initialData={trainingFormData}
                  visibleDays={trainingVisibleDays}
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
