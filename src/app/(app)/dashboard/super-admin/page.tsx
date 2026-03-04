import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "../../../../components/Dashboard/overview-cards/card";
import * as icons from "@/components/IconsCollection/icons";
import { compactFormat } from "@/lib/formatters/format-number";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";
import { getOwnerData, getTopCoaches, getTopGym } from "@/data/superAdmin";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function SuperAdminDashboardPage({
  searchParams,
}: PropsType) {
  const { users, company, coach, revenue } = await getOwnerData();
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <div>
      <DashboardSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            label="Total Users"
            data={{
              ...users,
              value: compactFormat(users.value),
            }}
            Icon={icons.Users}
          />
          <OverviewCard
            label="Gym Count"
            data={{
              ...company,
              value: compactFormat(company.value),
            }}
            Icon={icons.Gym}
          />
          <OverviewCard
            label="Coach Count"
            data={{
              ...coach,
              value: compactFormat(coach.value),
            }}
            Icon={icons.Trainer}
          />
          <OverviewCard
            label="Total Revenue"
            data={{
              ...revenue,
              value: compactFormat(revenue.value),
            }}
            Icon={icons.Profit}
          />
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
              data={getTopGym()}
              buttonLabel="View All"
              buttonPath="/dashboard/super-admin/company"
            />
          </Suspense>
        </div>

        <div className="col-span-12 mt-8 grid xl:col-span-6">
          <Suspense fallback={<Skeleton />}>
            <TableUI
              title="Last 5 Coaches"
              data={getTopCoaches()}
              buttonLabel="View All"
              buttonPath="/dashboard/super-admin/coaches"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
