import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getRoleFromAuthContext } from "@/config/routes.config";
import { loadCurrentClientProfile } from "@/app/(app)/dashboard/company/clients/actions";
import { ClientProfilePage } from "@/components/Dashboard/company/client-profile/client-profile-page";
import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { getCompanyAnnouncements } from "@/services/dashboard.services";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { SearchType } from "@/types/dashboard/dashboard-shared";
import { Suspense } from "react";
import { Skeleton } from "@/components/Tables/skeleton";
import { TableUI } from "@/components/Tables";
import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import { announcementColumns } from "@/components/Dashboard/table-column/announcement-preview-columns";
import {
  coachClientColumns,
  coachUpcomingSessionColumns,
  newSignupColumns,
} from "@/components/Dashboard/table-column/company-columns";
import { getOverviewCompanyData } from "@/services/company/main";
import { compactFormat } from "@/lib/formatters/format-number";
import {
  getCompanyClients,
  getCompanyLastFiveClients,
} from "@/services/company/company.service";
import { getCoachUpcomingTrainingSessions } from "@/services/company/training-session.service";
import { Trainer } from "@/components/IconsCollection/icons";
import { PaymentsOverview } from "@/components/Charts/payments-overview";

export default async function CompanyDashboardPage({
  searchParams,
}: SearchType) {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);

  if (role === "client") {
    const profileData = await loadCurrentClientProfile();
    if (!profileData) notFound();

    return (
      <ClientProfilePage
        client={profileData.client}
        companyPricing={profileData.companyPricing}
        initialDiets={profileData.initialDiets}
        initialTrainingPlans={profileData.initialTrainingPlans}
        initialTrainingSessions={profileData.initialTrainingSessions}
        readOnly
      />
    );
  }

  if (role === "company-coach") {
    const [{ clients, totalCount }, upcomingSessions] = await Promise.all([
      getCompanyClients({ pageSize: 5 }),
      getCoachUpcomingTrainingSessions(5),
    ]);

    return (
      <div>
        <DashboardSection title="Overview">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              label="Total Clients"
              data={{ value: compactFormat(totalCount) }}
              Icon={Trainer}
            />
          </div>
        </DashboardSection>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
          <TableUI
            title="Clients"
            data={clients}
            columns={coachClientColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/clients"
          />
          <TableUI
            title="Upcoming Sessions"
            description="Your next booked sessions with clients, time, and current status."
            data={upcomingSessions}
            columns={coachUpcomingSessionColumns}
            rowKey={(row) => row.id}
          />
        </div>
      </div>
    );
  }

  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const overviewData = await getOverviewCompanyData();
  const last5Clients = await getCompanyLastFiveClients();

  const [announcements] = await Promise.all([getCompanyAnnouncements(4)]);

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
            title="New Clients"
            data={last5Clients}
            columns={newSignupColumns}
            buttonLabel="View All"
            buttonPath="/dashboard/company/clients"
          />
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <TableUI
            title="Announcements"
            description="Recent announcements and events."
            data={announcements}
            columns={announcementColumns}
            rowKey={(row) => row.id}
            headerActions={
              <Link href={ROUTES.DASHBOARD.COMPANY.ANNOUNCEMENT}>
                <Button label="View All" size="small" />
              </Link>
            }
          />
        </Suspense>
      </div>
    </div>
  );
}
