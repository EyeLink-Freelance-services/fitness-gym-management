import { ProgressRecordsTable } from "@/components/Dashboard/client-records/progress-records-table";
import { ProgressSeriesCard } from "@/components/Dashboard/client-records/progress-series-card";
import { ProgressSummaryCards } from "@/components/Dashboard/client-records/progress-summary-cards";
import { Button } from "@/components/ui-elements/button";
import { getPersonalCoachProgressOverview } from "@/services/coach-schema.services";

export default async function PersonalCoachProgressPage() {
  const progress = await getPersonalCoachProgressOverview();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Progress - Wei Liang
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
            8 records · Jan-Mar 2026
          </p>
        </div>
        <div className="flex gap-3">
          <select className="h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none dark:border-dark-3 dark:text-white">
            <option>Wei Liang</option>
          </select>
          <Button label="Export" size="small" variant="outlineDark" />
        </div>
      </div>

      <ProgressSummaryCards metrics={progress.summaryCards} />

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        {progress.series.map((series) => (
          <ProgressSeriesCard key={series.id} series={series} />
        ))}
      </div>

      <ProgressRecordsTable records={progress.records} />
    </div>
  );
}
