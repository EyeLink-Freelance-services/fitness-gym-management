"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { ProgressRecordsTable } from "@/components/Dashboard/client-records/progress-records-table";
import { ProgressSeriesCard } from "@/components/Dashboard/client-records/progress-series-card";
import { ProgressSummaryCards } from "@/components/Dashboard/client-records/progress-summary-cards";
import { coachDietPlanColumns, coachTrainingPlanColumns } from "@/components/Dashboard/table-column/personal-coach-plan-columns";
import PersonalCoachDietPlanForm from "@/components/Forms/PersonalCoachDietPlanForm";
import PersonalCoachTrainingPlanForm from "@/components/Forms/PersonalCoachTrainingPlanForm";
import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import type {
  CoachDietPlanRecord,
  CoachDietPlanRow,
  CoachMealTimeOption,
  CoachTrainingPlanDay,
  CoachTrainingPlanRecord,
  CoachTrainingPlanRow,
} from "@/types/dashboard/client";
import type {
  ClientRecordRow,
  CoachClient,
  ComputedMetric,
  ProgressSeries,
} from "@/types/dashboard/client-records";
import type {
  PersonalCoachDietPlanFormData,
  PersonalCoachTrainingPlanFormData,
} from "@/types/forms";
import { initials } from "@/utils/dashboard/shared";

type ActivePlanDialog =
  | { type: "diet"; mode: "create" | "edit"; planId?: string }
  | { type: "training"; mode: "create" | "edit"; planId?: string }
  | null;

type PersonalCoachClientProgressViewProps = {
  clientId: string;
  client: CoachClient;
  summaryCards: ComputedMetric[];
  series: ProgressSeries[];
  records: ClientRecordRow[];
  initialDietPlans: CoachDietPlanRecord[];
  initialTrainingPlans: CoachTrainingPlanRecord[];
};

const TRAINING_DAYS: CoachTrainingPlanDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function formatUpdatedAt(date: string) {
  return new Date(date).toISOString();
}

function formatDietSlotLabel(
  timeSlot: CoachMealTimeOption,
  specificTime?: string,
) {
  if (timeSlot !== "Specific") {
    return timeSlot;
  }

  return specificTime ? `Specific (${specificTime})` : "Specific";
}

function formatRepeatsLabel(record: CoachTrainingPlanRecord) {
  const values = [
    record.repeatEveryWeek ? "Weekly" : null,
    record.repeatEveryMonth ? "Monthly" : null,
  ].filter(Boolean);

  return values.length > 0 ? values.join(", ") : "No repeat";
}

function toDietRow(record: CoachDietPlanRecord): CoachDietPlanRow {
  return {
    id: record.id,
    clientName: record.clientName,
    mealsSummary: record.meals
      .map((meal) => formatDietSlotLabel(meal.timeSlot, meal.specificTime))
      .join(" | "),
    totalMeals: record.meals.length,
    updatedAt: record.updatedAt,
  };
}

function toTrainingRow(record: CoachTrainingPlanRecord): CoachTrainingPlanRow {
  const byDay = Object.fromEntries(
    record.days.map((entry) => [entry.day, entry.exercise]),
  ) as Record<CoachTrainingPlanDay, string>;

  return {
    id: record.id,
    clientName: record.clientName,
    monday: byDay.Monday ?? "-",
    tuesday: byDay.Tuesday ?? "-",
    wednesday: byDay.Wednesday ?? "-",
    thursday: byDay.Thursday ?? "-",
    friday: byDay.Friday ?? "-",
    saturday: byDay.Saturday ?? "-",
    sunday: byDay.Sunday ?? "-",
    repeats: formatRepeatsLabel(record),
    updatedAt: record.updatedAt,
  };
}

function toDietFormData(
  client: CoachClient,
  record?: CoachDietPlanRecord,
): PersonalCoachDietPlanFormData {
  return {
    clientId: client.id,
    clientName: client.name,
    meals:
      record?.meals.map((meal) => ({
        timeSlot: meal.timeSlot,
        specificTime: meal.specificTime ?? "",
        meal: meal.meal,
      })) ?? [{ timeSlot: "Breakfast", specificTime: "", meal: "" }],
  };
}

function toTrainingFormData(
  client: CoachClient,
  record?: CoachTrainingPlanRecord,
): PersonalCoachTrainingPlanFormData {
  const byDay = Object.fromEntries(
    (record?.days ?? []).map((entry) => [entry.day, entry.exercise]),
  ) as Partial<Record<CoachTrainingPlanDay, string>>;

  return {
    clientId: client.id,
    clientName: client.name,
    monday: byDay.Monday ?? "",
    tuesday: byDay.Tuesday ?? "",
    wednesday: byDay.Wednesday ?? "",
    thursday: byDay.Thursday ?? "",
    friday: byDay.Friday ?? "",
    saturday: byDay.Saturday ?? "",
    sunday: byDay.Sunday ?? "",
    repeatEveryWeek: record?.repeatEveryWeek ?? true,
    repeatEveryMonth: record?.repeatEveryMonth ?? false,
  };
}

function toDietRecord(
  values: PersonalCoachDietPlanFormData,
  existingId?: string,
): CoachDietPlanRecord {
  return {
    id: existingId ?? createId("diet-plan"),
    clientId: values.clientId,
    clientName: values.clientName,
    updatedAt: formatUpdatedAt(new Date().toISOString()),
    meals: values.meals.map((meal, index) => ({
      id: `${existingId ?? "diet-meal"}-${index + 1}`,
      timeSlot: meal.timeSlot,
      specificTime:
        meal.timeSlot === "Specific" ? meal.specificTime?.trim() ?? "" : undefined,
      meal: meal.meal.trim(),
    })),
  };
}

function toTrainingRecord(
  values: PersonalCoachTrainingPlanFormData,
  existingId?: string,
): CoachTrainingPlanRecord {
  const exercisesByDay: Record<CoachTrainingPlanDay, string> = {
    Monday: values.monday.trim(),
    Tuesday: values.tuesday.trim(),
    Wednesday: values.wednesday.trim(),
    Thursday: values.thursday.trim(),
    Friday: values.friday.trim(),
    Saturday: values.saturday.trim(),
    Sunday: values.sunday.trim(),
  };

  return {
    id: existingId ?? createId("training-plan"),
    clientId: values.clientId,
    clientName: values.clientName,
    updatedAt: formatUpdatedAt(new Date().toISOString()),
    repeatEveryWeek: values.repeatEveryWeek,
    repeatEveryMonth: values.repeatEveryMonth,
    days: TRAINING_DAYS.map((day) => ({
      day,
      exercise: exercisesByDay[day],
    })),
  };
}

export function PersonalCoachClientProgressView({
  clientId,
  client,
  summaryCards,
  series,
  records,
  initialDietPlans,
  initialTrainingPlans,
}: PersonalCoachClientProgressViewProps) {
  const [dietPlans, setDietPlans] = useState(initialDietPlans);
  const [trainingPlans, setTrainingPlans] = useState(initialTrainingPlans);
  const [activeDialog, setActiveDialog] = useState<ActivePlanDialog>(null);

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

  const recordCount = records.length;

  const handleDietSubmit = (values: PersonalCoachDietPlanFormData) => {
    const nextRecord = toDietRecord(values, selectedDietPlan?.id);

    setDietPlans((current) => {
      const withoutCurrent = current.filter((plan) => plan.id !== nextRecord.id);
      return [nextRecord, ...withoutCurrent];
    });
    setActiveDialog(null);
  };

  const handleTrainingSubmit = (values: PersonalCoachTrainingPlanFormData) => {
    const nextRecord = toTrainingRecord(values, selectedTrainingPlan?.id);

    setTrainingPlans((current) => {
      const withoutCurrent = current.filter((plan) => plan.id !== nextRecord.id);
      return [nextRecord, ...withoutCurrent];
    });
    setActiveDialog(null);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
                {initials(client.name)}
              </span>
              <CardTitle
                title={client.name}
                subtitle={`${recordCount} records · Since ${new Date(client.lastEntryAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`${ROUTES.DASHBOARD.PERSONAL_COACH.DATA_ENTRY}?clientId=${clientId}`}
              >
                <Button label="Edit" size="small" variant="outlineDark" />
              </Link>
              <Button
                label="Diet Plan"
                size="small"
                variant="outlineDark"
                onClick={() => setActiveDialog({ type: "diet", mode: "create" })}
              />
              <Button
                label="Training Plan"
                size="small"
                onClick={() =>
                  setActiveDialog({ type: "training", mode: "create" })
                }
              />
            </div>
          </div>
        </section>

        <ProgressSummaryCards metrics={summaryCards} />

        <div className="grid gap-6 xl:grid-cols-2">
          {series.map((item) => (
            <ProgressSeriesCard key={item.id} series={item} />
          ))}
        </div>

        <ProgressRecordsTable records={records} />

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
