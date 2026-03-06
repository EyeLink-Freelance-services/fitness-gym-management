import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ANNOUNCEMENTS,
  COACH_ASSIGNMENTS,
  MEDICAL_ALERTS,
  PENDING_COACH,
} from "@/data/company";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import {
  getCompanyOverviewData,
  getExpiringSoonGyms,
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

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-8">
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
              buttonPath="/dashboard/super-admin/company"
            />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Coach → Client assignment">
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Coach</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COACH_ASSIGNMENTS.map((row) => (
                  <TableRow key={row.client}>
                    <TableCell className="font-medium">{row.client}</TableCell>
                    <TableCell>{row.coach}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardSection>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DashboardSection title="Announcements">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {ANNOUNCEMENTS.map((a) => (
              <li key={a.title} className="text-sm text-dark dark:text-white">
                <span className="font-medium">{a.title}</span>
                <span className="ml-2 text-dark-6">{a.date}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
        <DashboardSection title="Medical alerts">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {MEDICAL_ALERTS.map((m) => (
              <li key={m.name} className="text-sm">
                <span className="font-medium text-dark dark:text-white">
                  {m.name}
                </span>
                <p className="mt-1 text-dark-6">{m.note}</p>
              </li>
            ))}
          </ul>
        </DashboardSection>
        <DashboardSection title="New signups — pending coach">
          <ul className="space-y-2 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
            {PENDING_COACH.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium text-dark dark:text-white">
                  {p.name}
                </span>
                <span className="text-dark-6">{p.joined}</span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      </div>
    </div>
  );
}
