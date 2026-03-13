import { BodyCompositionCard } from "@/components/Dashboard/client/body-composition-card";
import { WeightTrendCard } from "@/components/Dashboard/client/weight-trend-card";
import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { TableUI } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { cn } from "@/lib/utils";
import {
  getClientBodyComposition,
  getClientBodyMeasurements,
  getClientCoachSummary,
  getClientMealPlan,
  getClientMembershipSummary,
  getClientOverviewData,
  getClientPaymentHistory,
  getClientUpcomingSessions,
  getClientWeightTrend,
  getClientWorkoutPlan,
} from "@/services/dashboard.services";
import type {
  ClientBodyMeasurementRow,
  ClientMealPlanRow,
  ClientPaymentRow,
  ClientUpcomingSessionRow,
  ClientWorkoutPlanRow,
} from "@/types/dashboard/client";
import type { StatusTone, TableUIColumn } from "@/types/shared";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getToneTextClassName(tone: StatusTone) {
  if (tone === "success") {
    return "text-green";
  }

  if (tone === "warning") {
    return "text-[#FFA70B]";
  }

  if (tone === "danger") {
    return "text-red";
  }

  if (tone === "primary") {
    return "text-primary";
  }

  return "text-dark-5";
}

const upcomingSessionColumns: TableUIColumn<ClientUpcomingSessionRow>[] = [
  {
    key: "session",
    label: "Session",
    align: "left",
    render: (row) => (
      <div>
        <p className="font-medium text-dark dark:text-white">{row.session}</p>
        <p className="text-sm text-dark-6 dark:text-dark-5">
          {row.coachName} . {row.location}
        </p>
      </div>
    ),
    headClassName: "min-w-[210px]",
  },
  {
    key: "startsAt",
    label: "Date",
    render: (row) => formatDate(row.startsAt),
    headClassName: "min-w-[140px]",
  },
  {
    key: "time",
    label: "Time",
    render: (row) => formatTime(row.startsAt),
    headClassName: "min-w-[110px]",
  },
  {
    key: "durationMinutes",
    label: "Duration",
    render: (row) => `${row.durationMinutes} min`,
    headClassName: "min-w-[110px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge label={row.status} tone={row.statusTone} />,
    headClassName: "min-w-[120px]",
  },
];

const bodyMeasurementColumns: TableUIColumn<ClientBodyMeasurementRow>[] = [
  {
    key: "metric",
    label: "Metric",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "value",
    label: "Current",
    headClassName: "min-w-[110px]",
  },
  {
    key: "change",
    label: "Change",
    render: (row) => (
      <span
        className={cn(
          "font-medium",
          getToneTextClassName(row.changeTone),
          row.changeTone === "neutral" && "dark:text-dark-5",
        )}
      >
        {row.change}
      </span>
    ),
    headClassName: "min-w-[110px]",
  },
  {
    key: "lastUpdated",
    label: "Updated",
    render: (row) => formatDate(row.lastUpdated),
    headClassName: "min-w-[130px]",
  },
];

const workoutPlanColumns: TableUIColumn<ClientWorkoutPlanRow>[] = [
  {
    key: "day",
    label: "Day",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "focus",
    label: "Training Focus",
    align: "left",
    render: (row) => (
      <div>
        <p className="font-medium text-dark dark:text-white">{row.focus}</p>
        <p className="text-sm text-dark-6 dark:text-dark-5">{row.exercises}</p>
      </div>
    ),
    headClassName: "min-w-[260px]",
  },
  {
    key: "duration",
    label: "Duration",
    headClassName: "min-w-[110px]",
  },
  {
    key: "volume",
    label: "Volume",
    headClassName: "min-w-[140px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge label={row.status} tone={row.statusTone} />,
    headClassName: "min-w-[120px]",
  },
];

const mealPlanColumns: TableUIColumn<ClientMealPlanRow>[] = [
  {
    key: "meal",
    label: "Meal",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "time",
    label: "Time",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "items",
    label: "Items",
    align: "left",
    headClassName: "min-w-[280px]",
  },
  {
    key: "macros",
    label: "Macros",
    headClassName: "min-w-[120px]",
  },
  {
    key: "calories",
    label: "Calories",
    headClassName: "min-w-[120px]",
  },
];

const paymentHistoryColumns: TableUIColumn<ClientPaymentRow>[] = [
  {
    key: "invoice",
    label: "Invoice",
    align: "left",
    headClassName: "min-w-[150px]",
  },
  {
    key: "plan",
    label: "Plan",
    align: "left",
    headClassName: "min-w-[120px]",
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (row) => (
      <span className="font-medium text-dark dark:text-white">{row.amount}</span>
    ),
    headClassName: "min-w-[120px]",
  },
  {
    key: "paidAt",
    label: "Date",
    render: (row) => formatDate(row.paidAt),
    headClassName: "min-w-[120px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge label={row.status} tone={row.statusTone} />,
    headClassName: "min-w-[140px]",
  },
];

export default async function ClientDashboardPage() {
  const [
    overviewData,
    membershipSummary,
    coachSummary,
    weightTrend,
    bodyComposition,
    upcomingSessions,
    bodyMeasurements,
    workoutPlan,
    mealPlan,
    paymentHistory,
  ] = await Promise.all([
    getClientOverviewData(),
    getClientMembershipSummary(),
    getClientCoachSummary(),
    getClientWeightTrend(),
    getClientBodyComposition(),
    getClientUpcomingSessions(4),
    getClientBodyMeasurements(),
    getClientWorkoutPlan(),
    getClientMealPlan(),
    getClientPaymentHistory(4),
  ]);

  const ptSessionProgress = Math.round(
    (membershipSummary.ptSessionsUsed / membershipSummary.ptSessionsTotal) * 100,
  );

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

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Premium Plan
              </span>
              <h2 className="mt-3 text-body-2xlg font-bold text-dark dark:text-white">
                {membershipSummary.planName}
              </h2>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
                {membershipSummary.monthlyPrice} . {membershipSummary.renewalMode}
              </p>
            </div>

            <StatusBadge label="Active" tone="success" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Member Since
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {membershipSummary.memberSince}
              </p>
            </div>
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Current Period
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {membershipSummary.currentPeriod}
              </p>
            </div>
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Branch Access
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {membershipSummary.branch}
              </p>
            </div>
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Renewal In
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {membershipSummary.daysRemaining} days
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-medium text-dark dark:text-white">
                PT Sessions This Month
              </h3>
              <span className="text-sm text-dark-6 dark:text-dark-5">
                {membershipSummary.ptSessionsUsed}/{membershipSummary.ptSessionsTotal} used
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-dark-2 dark:bg-dark-3">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${ptSessionProgress}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-medium text-dark dark:text-white">
              What's Included
            </h3>
            <ul className="space-y-2 text-sm text-dark-6 dark:text-dark-5">
              {membershipSummary.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 size-2 rounded-full bg-green"
                    aria-hidden
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
              {coachSummary.initials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                {coachSummary.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-dark-6 dark:text-dark-5">
                {coachSummary.title}
              </p>
              <p className="mt-2 text-sm text-dark-6 dark:text-dark-5">
                {coachSummary.location}
              </p>
            </div>

            <StatusBadge label={coachSummary.availability} tone="success" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Rating
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {coachSummary.rating}
              </p>
            </div>
            <div className="rounded-lg bg-gray-1 px-4 py-3 dark:bg-dark-2">
              <p className="text-xs uppercase tracking-[0.2em] text-dark-5">
                Experience
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {coachSummary.experience}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="mb-3 font-medium text-dark dark:text-white">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {coachSummary.certifications.map((certification) => (
                  <span
                    key={certification}
                    className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {certification}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-dark dark:text-white">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {coachSummary.languages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex rounded-full bg-green/10 px-3 py-1 text-sm font-medium text-green"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <WeightTrendCard data={weightTrend} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <BodyCompositionCard data={bodyComposition} />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-12 gap-6">
        <TableUI
          title="Upcoming Sessions"
          description="Your next booked sessions with coach, time, and current status."
          data={upcomingSessions}
          columns={upcomingSessionColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-7"
          headerActions={
            <Button
              label="View Calendar"
              size="small"
              toastMessage="Calendar page is not connected yet."
            />
          }
        />

        <TableUI
          title="Body Measurements"
          description="Latest measurements recorded during your check-ins."
          data={bodyMeasurements}
          columns={bodyMeasurementColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-5"
        />
      </div>

      <TableUI
        title="Weekly Training Plan"
        description="Your current split with session focus, duration, and training volume."
        data={workoutPlan}
        columns={workoutPlanColumns}
        rowKey={(row) => row.id}
        className="mb-8"
        tableClassName="min-w-[880px]"
        headerActions={
          <Button
            label="View Full Plan"
            size="small"
            toastMessage="Training plan details page not yet created."
          />
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <TableUI
          title="Nutrition Plan"
          description="Structured meals for training days with target macros and calories."
          data={mealPlan}
          columns={mealPlanColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-7"
          tableClassName="min-w-[860px]"
          headerActions={
            <Button
              label="Request Change"
              size="small"
              toastMessage="Nutrition support request flow not yet created."
            />
          }
        />

        <TableUI
          title="Payment History"
          description="Recent invoices and membership payments."
          data={paymentHistory}
          columns={paymentHistoryColumns}
          rowKey={(row) => row.id}
          className="col-span-12 xl:col-span-5"
          tableClassName="min-w-[760px]"
          headerActions={
            <Button
              label="Download Invoice"
              size="small"
              toastMessage="Invoice download is not connected yet."
            />
          }
        />
      </div>
    </div>
  );
}
