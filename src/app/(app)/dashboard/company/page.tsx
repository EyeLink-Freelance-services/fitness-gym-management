import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import {
  getCompanyOverviewData,
  getGymCoachCLientAssign,
  getGymNewClient,
  getPersonalCoachAnnouncements,
} from "@/services/dashboard.services";
import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { SearchType } from "@/types/dashboard/dashboard-shared";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";
import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import { announcementColumns } from "@/components/Dashboard/table-column/personal-coach-preview-columns";
import {
  coachAssignmentColumns,
  newSignupColumns,
} from "@/components/Dashboard/table-column/company-columns";

export default async function CompanyDashboardPage({
  searchParams,
}: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  const [overviewData, announcements] = await Promise.all([
    getCompanyOverviewData(),
    getPersonalCoachAnnouncements(4),
  ]);

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
        <PaymentsOverview
          className="col-span-12"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="Coach & Client Assignments"
            data={getGymCoachCLientAssign(5)}
            columns={coachAssignmentColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/client-coach-assign"
          />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="New Clients"
            data={getGymNewClient(5)}
            columns={newSignupColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/clients"
          />
        </Suspense>{" "}
      </div>

      <TableUI
        title="Announcements"
        description="Recent client communications and scheduled updates."
        data={announcements}
        columns={announcementColumns}
        rowKey={(row) => row.id}
        className="col-span-12 xl:col-span-5"
        headerActions={
          <Link href={ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT}>
            <Button label="View All" size="small" />
          </Link>
        }
      />
    </div>
  );
}
