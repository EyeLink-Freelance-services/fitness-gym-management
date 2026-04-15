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
  getFiveLastCoaches,
} from "@/services/dashboard.services";
import {
  superAdminCoachPreviewColumns,
  superAdminCompanyPreviewColumns,
} from "@/components/Dashboard/table-column/super-admin-column";
import { getLastFiveCompanies } from "@/modules/company/company.service";
import { OVERVIEW_SUPER_ADMIN_DATA } from "@/data/superAdmin";

export default async function SuperAdminDashboardPage({
  searchParams,
}: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const lastFiveComapanies = await getLastFiveCompanies();
  const getSuperAdminOverviewData = () => {
    const totalCompanies = 5

    return OVERVIEW_SUPER_ADMIN_DATA.map((item) =>
      item.name === "Total Companies"
        ? { ...item, value: totalCompanies }
        : item,
    );
  };

  return (
    <div>
      <DashboardSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getSuperAdminOverviewData().map((item) => (
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
              title="Last 5 Gyms"
              data={lastFiveComapanies}
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
              data={await getFiveLastCoaches(5)}
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
