import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { ANNOUNCEMENTS } from "@/data/company";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import {
  getCompanyOverviewData,
  getExpiringSoonGyms,
  getGymCoachCLientAssign,
  getGymNewClient,
} from "@/services/dashboard.services";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { SearchType } from "@/types/dashboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";

export default async function CompanyDashboardPage({
  searchParams,
}: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const overviewData = await getCompanyOverviewData();
  return (
    <div>
      <DashboardSection title="Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewData.map((item) => (
            <OverviewCard
              key={item.label}
              label={item.label}
              data={{
                value: item.value,
                growthRate: item.trend ?? 0,
              }}
              Icon={item.icon}
            />
          ))}
        </div>
      </DashboardSection>

      <div className="mb-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 grid xl:col-span-8">
          <PaymentsOverview
            className="col-span-12 xl:col-span-7"
            key={extractTimeFrame("payments_overview")}
            timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
          />
        </div>

        <div className="col-span-12 grid xl:col-span-4">
          <Suspense fallback={<Skeleton />}>
            <TableUI
              title="Expiring Soon"
              data={getExpiringSoonGyms(5)}
              buttonLabel="View All"
              buttonPath="/dashboard/company"
            />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="Coach & Client Assigned"
            data={getGymCoachCLientAssign(5)}
            buttonLabel="View All"
            buttonPath="/dashboard/company"
          />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="New Signups"
            data={getGymNewClient(5)}
            buttonLabel="View All"
            buttonPath="/dashboard/company"
          />
        </Suspense>{" "}
      </div>

      <div>
        <DashboardSection
          title="Announcements"
          buttonLabel="Create"
          buttonPath="/dashboard/company"
          buttonToast="Need to create an announcement form"
        >
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {ANNOUNCEMENTS.map((a) => (
              <li
                key={a.title}
                className="flex flex-col gap-2 text-sm text-dark dark:text-white"
              >
                <span className="font-medium">{a.title}</span>
                <span className="ml-2 text-dark-6">{a.desc}</span>
                <span className="ml-2 text-dark-6">- {a.time}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>
    </div>
  );
}
