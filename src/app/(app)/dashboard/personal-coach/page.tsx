import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { ClientProgressCard } from "@/components/Dashboard/personal-coach/client-progress-card";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { SessionsCard } from "@/components/Dashboard/personal-coach/sessions-card";
import { TableUI } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { cn } from "@/lib/utils";
import {
  getPersonalCoachAnnouncements,
  getPersonalCoachClientProgress,
  getPersonalCoachMedicalNotes,
  getPersonalCoachOverviewData,
  getPersonalCoachProgressSeries,
  getPersonalCoachTodaySessions,
} from "@/services/dashboard.services";
import type {
  PersonalCoachAnnouncementRow,
  PersonalCoachClientProgressRow,
  PersonalCoachMedicalNoteRow,
} from "@/types/dashboard/personal-coach";
import type { TableUIColumn } from "@/types/shared";
import { toast } from "sonner";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getProgressBarClassName(progress: number) {
  if (progress >= 70) {
    return "bg-green";
  }

  if (progress >= 50) {
    return "bg-primary";
  }

  return "bg-[#FFA70B]";
}

const clientProgressColumns: TableUIColumn<PersonalCoachClientProgressRow>[] = [
  {
    key: "clientName",
    label: "Client",
    align: "left",
    headClassName: "min-w-[170px]",
  },
  {
    key: "goal",
    label: "Goal",
    align: "left",
    headClassName: "min-w-[130px]",
  },
  {
    key: "progress",
    label: "Progress",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-dark-2 dark:bg-dark-3">
          <div
            className={cn(
              "h-full rounded-full",
              getProgressBarClassName(row.progress),
            )}
            style={{ width: `${row.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-dark dark:text-white">
          {row.progress}%
        </span>
      </div>
    ),
    headClassName: "min-w-[170px]",
  },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <div className="flex justify-center gap-2">
        <Button
          label="Plan"
          size="small"
          variant="outlineDark"
          className="px-4 py-2"
          toastMessage="Training plan page not yet created"
        />
        <Button
          label="Diet"
          size="small"
          variant="outlineDark"
          className="px-4 py-2"
          toastMessage="Diet plan page not yet created"
        />
      </div>
    ),
    headClassName: "min-w-[170px]",
  },
];

const medicalNoteColumns: TableUIColumn<PersonalCoachMedicalNoteRow>[] = [
  {
    key: "clientName",
    label: "Client",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "note",
    label: "Condition",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "restriction",
    label: "Restriction",
    align: "left",
    headClassName: "min-w-[240px]",
  },
  {
    key: "severity",
    label: "Severity",
    render: (row) => (
      <StatusBadge label={row.severity} tone={row.severityTone} />
    ),
    headClassName: "min-w-[120px]",
  },
];

const announcementColumns: TableUIColumn<PersonalCoachAnnouncementRow>[] = [
  {
    key: "title",
    label: "Announcement",
    align: "left",
    headClassName: "min-w-[260px]",
  },
  {
    key: "audience",
    label: "Audience",
    align: "left",
    headClassName: "min-w-[200px]",
  },
  {
    key: "publishAt",
    label: "Publish Date",
    render: (row) => formatDate(row.publishAt),
    headClassName: "min-w-[140px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge label={row.status} tone={row.statusTone} />,
    headClassName: "min-w-[120px]",
  },
];

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
    getPersonalCoachAnnouncements(3),
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
              Icon={item.icon}
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
              label="View Clients"
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
        <TableUI
          title="Medical Notes"
          description="Keep restrictions and risk flags visible during planning."
          data={medicalNotes}
          columns={medicalNoteColumns}
          rowKey={(row) => row.id}
          tableClassName="min-w-[640px]"
          buttonLabel="View all Medical History"
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
