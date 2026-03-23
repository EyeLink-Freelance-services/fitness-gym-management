import { notFound } from "next/navigation";
import { ProgressRecordsTable } from "@/components/Dashboard/client-records/progress-records-table";
import { ProgressSeriesCard } from "@/components/Dashboard/client-records/progress-series-card";
import { ProgressSummaryCards } from "@/components/Dashboard/client-records/progress-summary-cards";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { Button } from "@/components/ui-elements/button";
import Link from "next/link";
import { getPersonalCoachProgressOverview } from "@/services/coach-schema.services";
import { ROUTES } from "@/constants/route";
import { initials } from "@/utils/dashboard/shared";

type PageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function PersonalCoachClientProgressPage({
  params,
}: PageProps) {
  const { clientId } = await params;
  const progress = await getPersonalCoachProgressOverview(clientId);

  if (!progress.client) {
    notFound();
  }

  const client = progress.client;
  const recordCount = progress.records.length;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[12px] border border-stroke/70 bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
              {initials(client.name)}
            </span>
            <CardTitle
              title={client.name}
              subtitle={`${recordCount} records · Since ${new Date(client.lastEntryAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
            />
          </div>
          <Link href={`${ROUTES.DASHBOARD.PERSONAL_COACH.DATA_ENTRY}?clientId=${clientId}`}>
            <Button label="Edit" size="small" variant="outlineDark" />
          </Link>
        </div>
      </section>

      <ProgressSummaryCards metrics={progress.summaryCards} />

      <div className="grid gap-6 xl:grid-cols-2">
        {progress.series.map((series) => (
          <ProgressSeriesCard key={series.id} series={series} />
        ))}
      </div>

      <ProgressRecordsTable records={progress.records} />
    </div>
  );
}
