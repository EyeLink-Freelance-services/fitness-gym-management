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
import { SearchType } from "@/types/dashboard/dashboard-shared";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { TableUIColumn } from "@/types/shared";

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const expiringSoonColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "name",
    label: "Member",
    align: "left",
    headClassName: "min-w-[180px]",
  },
  {
    key: "plan",
    label: "Plan",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "expiresAt",
    label: "Expires At",
    render: (row) => formatDate(row.expiresAt),
    headClassName: "min-w-[140px]",
  },
];

const coachAssignmentColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[180px]",
  },
  {
    key: "coach",
    label: "Coach Name",
    align: "left",
    render: (row) => row.coach ?? "Unassigned",
    headClassName: "min-w-[160px]",
  },
  {
    key: "status",
    label: "Status",
    headClassName: "min-w-[120px]",
  },
  {
    key: "assignedOn",
    label: "Assigned On",
    render: (row) => formatDate(row.assignedOn),
    headClassName: "min-w-[140px]",
  },
];

const newSignupColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[180px]",
  },
  {
    key: "contact",
    label: "Contact",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "plan",
    label: "Plan",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "joinedAt",
    label: "Joined At",
    render: (row) => formatDate(row.joinedAt),
    headClassName: "min-w-[140px]",
  },
];

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
              columns={expiringSoonColumns}
              buttonLabel="View All"
              buttonPath="/dashboard/company/clients"
            />
          </Suspense>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="Coach & Client Assigned"
            data={getGymCoachCLientAssign(5)}
            columns={coachAssignmentColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/clientCoachAssign"
          />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="New Signups"
            data={getGymNewClient(5)}
            columns={newSignupColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/clients"
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
