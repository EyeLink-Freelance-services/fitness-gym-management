"use client";

import { useEffect, useState } from "react";
import { ProgressRecordsTable } from "@/components/Dashboard/client-records/progress-records-table";
import { ProgressSeriesCard } from "@/components/Dashboard/client-records/progress-series-card";
import { ProgressSummaryCards } from "@/components/Dashboard/client-records/progress-summary-cards";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { Button } from "@/components/ui-elements/button";
import { getCompanyProgressOverview } from "@/services/coach-schema.services";
import { Member } from "@/types/member";

export default function ProgressPage(props: Member) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const progressRes = await getCompanyProgressOverview();
        setProgress(progressRes);
      } catch (error) {
        console.error("Failed to load progress overview:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!progress) {
    return <div className="p-4">No progress data found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
              WL
            </span>
            <CardTitle
              title="Wei Liang"
              subtitle="8 records · Since [date started here]"
            />
          </div>
          <Button label="Export" size="small" variant="outlineDark" />
        </div>
      </section>

      <ProgressSummaryCards metrics={progress.summaryCards} />

      <div className="grid gap-6 xl:grid-cols-2">
        {progress.series.map((series: any) => (
          <ProgressSeriesCard key={series.id} series={series} />
        ))}
      </div>

      <ProgressRecordsTable records={progress.records} />
    </div>
  );
}