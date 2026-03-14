import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { ClientProgressCard } from "@/components/Dashboard/personal-coach/client-progress-card";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { SessionsCard } from "@/components/Dashboard/personal-coach/sessions-card";
import { DataTable, TableUI } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";

import {
  getPersonalCoachAnnouncements,
  getPersonalCoachClientProgress,
  getPersonalCoachMedicalNotes,
  getPersonalCoachOverviewData,
  getPersonalCoachProgressSeries,
  getPersonalCoachTodaySessions,
} from "@/services/dashboard.services";
import {
  announcementColumns,
  clientProgressColumns,
  medicalNoteColumns,
} from "@/components/Dashboard/table-column/personal-coach";

export default async function PersonalCoachDashboardPage() {
  const [
    overviewData,
    sessions,
    progressSeries,
    clientProgress,
    announcements,
    medicalNotes,
  ] = await Promise.all([
    getPersonalCoachOverviewData(),
    getPersonalCoachTodaySessions(6),
    getPersonalCoachProgressSeries(),
    getPersonalCoachClientProgress(4),
    getPersonalCoachAnnouncements(4),
    getPersonalCoachMedicalNotes(3),
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
                growthRate: item.trend,
              }}
              // Icon={item.icon}
            />
          ))}
        </div>
      </DashboardSection>

      <div className="mb-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <ClientProgressCard data={progressSeries} />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <SessionsCard sessions={sessions} />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-12 gap-6">
        <TableUI
          title="My Clients"
          description="Manage current clients, goals, and active program progress."
          data={clientProgress}
          columns={clientProgressColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-7"
          headerActions={
            <Button
              label="View All"
              size="small"
              toastMessage="Promo creation is not connected yet."
            />
          }
        />

        <TableUI
          title="Announcements"
          description="Recent client communications and scheduled updates."
          data={announcements}
          columns={announcementColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-5"
          headerActions={
            <Button
              label="View All"
              size="small"
              toastMessage="Promo creation is not connected yet."
            />
          }
        />
      </div>

      <div className="col-span-12 grid gap-6 xl:col-span-5">
        <DataTable
          title="Medical Notes"
          description="Keep restrictions and risk flags visible during planning."
          data={medicalNotes}
          columns={medicalNoteColumns}
          tableClassName="min-w-[640px]"
          searchPlaceholder="Search client..."
          initialPageSize={4}
          emptyStateLabel="No client assignments available."
          headerActions={
            <Button
              label="Add Medical Notes"
              size="small"
              toastMessage="Promo creation is not connected yet."
            />
          }
        />
      </div>
    </div>
  );
}
