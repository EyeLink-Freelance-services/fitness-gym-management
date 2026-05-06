import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { compactFormat } from "@/lib/formatters/format-number";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";
import { SearchType } from "@/types/dashboard/dashboard-shared";
import {
  superAdminCoachPreviewColumns,
  superAdminCompanyPreviewColumns,
} from "@/components/Dashboard/table-column/super-admin-column";
import { getLastFiveCompanies } from "@/modules/super-admin/super-admin.service";
import { getLastFivePersonalCoaches } from "@/modules/personal-coach/personal-coach.service";
import { getOverviewSuperAdminData } from "@/services/super-admin/main";

export default async function SuperAdminDashboardPage({
  searchParams,
}: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const last5Companies = await getLastFiveCompanies();
  const lastFiveCoaches = await getLastFivePersonalCoaches();
  const overviewData = await getOverviewSuperAdminData();

  return (
    <div>
      <DashboardSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewData.map((item) => (
            <OverviewCard
              key={item.name}
              label={item.name}
              data={{
                ...item,
                value: compactFormat(item.value),
              }}
              Icon={item.icon}
            />
          ))}
        </div>
      </DashboardSection>

      <WeeksProfit
        key={extractTimeFrame("weeks_profit")}
        timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
        className="col-span-12 xl:col-span-5"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 mt-8 grid xl:col-span-6">
          <Suspense fallback={<Skeleton />}>
            <TableUI
              title="Last 5 Companies"
              data={last5Companies}
              columns={superAdminCompanyPreviewColumns}
              buttonLabel="View All"
              buttonPath="/dashboard/super-admin/company"
            />
          </Suspense>
        </div>

        <div className="col-span-12 mt-8 grid xl:col-span-6">
          <Suspense fallback={<Skeleton />}>
            <TableUI
              title="Last 5 Coaches"
              data={lastFiveCoaches}
              columns={superAdminCoachPreviewColumns}
              buttonLabel="View All"
              buttonPath="/dashboard/super-admin/coaches"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
