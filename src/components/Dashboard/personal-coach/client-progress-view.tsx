"use client";

import { useState } from "react";
import Link from "next/link";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { ProgressRecordsTable } from "@/components/Dashboard/client-records/progress-records-table";
import { ProgressSeriesCard } from "@/components/Dashboard/client-records/progress-series-card";
import { ProgressSummaryCards } from "@/components/Dashboard/client-records/progress-summary-cards";
import { CoachPlansSection } from "@/components/Dashboard/client-records/coach-plans-section";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import type { ActivePlanDialog } from "@/modules/client-records/coach-plan.types";
import type {
  CoachDietPlanRecord,
  CoachTrainingPlanRecord,
} from "@/types/dashboard/client";
import type {
  ClientRecordRow,
  CoachClient,
  ComputedMetric,
  ProgressSeries,
} from "@/types/dashboard/client-records";
import { initials } from "@/utils/dashboard/shared";

type PersonalCoachClientProgressViewProps = {
  clientId: string;
  client: CoachClient;
  summaryCards: ComputedMetric[];
  series: ProgressSeries[];
  records: ClientRecordRow[];
  initialDietPlans: CoachDietPlanRecord[];
  initialTrainingPlans: CoachTrainingPlanRecord[];
};

export function PersonalCoachClientProgressView({
  clientId,
  client,
  summaryCards,
  series,
  records,
  initialDietPlans,
  initialTrainingPlans,
}: PersonalCoachClientProgressViewProps) {
  const [activeDialog, setActiveDialog] = useState<ActivePlanDialog>(null);
  const recordCount = records.length;

  return (
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

      <CoachPlansSection
        client={{ id: clientId, name: client.name }}
        initialDietPlans={initialDietPlans}
        initialTrainingPlans={initialTrainingPlans}
        activeDialog={activeDialog}
        onActiveDialogChange={setActiveDialog}
      />
    </div>
  );
}
