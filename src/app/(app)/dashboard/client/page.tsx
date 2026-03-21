import { BodyCompositionCard } from "@/components/Dashboard/client/body-composition-card";
import { WeightTrendCard } from "@/components/Dashboard/client/weight-trend-card";
import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import {
  paymentHistoryColumns,
} from "@/components/Dashboard/table-column/client-columns";
import { bodyMeasurementColumns, mealPlanColumns, upcomingSessionColumns, workoutPlanColumns } from "@/components/Dashboard/table-column/personal-coach-preview-columns";
import { DataTable, TableUI } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
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
import Image from "next/image";

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

      <div className="mb-8 grid grid-cols-12 items-stretch gap-6">
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <DashboardSection
          className="mb-4"
            children={
              <>
                <div className="-mt-4 flex flex-wrap items-start justify-between gap-4">
                  <CardTitle title="Benefits" />
                  <StatusBadge
                    label={membershipSummary.planName}
                    tone="warning"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {membershipSummary.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3 dark:bg-dark-3"
                    >
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-green"
                        aria-hidden
                      />
                      <span className="text-sm text-dark dark:text-white">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            }
          />

          {coachSummary && (
            <DashboardSection
              title="Coach assigned"
              className="mb-0 flex min-h-0 flex-1 flex-col"
              children={
                <>
                  <div className="mb-4 rounded-lg bg-gray-100 px-4 py-4 dark:bg-dark-3">
                    <div className="flex items-center gap-4">
                      {coachSummary.picture ? (
                        <Image
                          src={coachSummary.picture}
                          className="size-12 shrink-0 rounded-full object-cover"
                          alt={`Avatar for ${coachSummary.name}`}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                          {coachSummary.initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                          {coachSummary.name}
                        </h2>
                        <p className="text-sm text-dark-6 dark:text-dark-6">
                          {coachSummary.location}
                        </p>
                      </div>

                      <StatusBadge label={coachSummary.title} tone="success" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="mb-2 text-xs font-medium text-dark-6 dark:text-dark-6">
                      Certifications:
                      <span className="ml-2 text-xs font-medium text-dark dark:text-white">
                        {coachSummary.certifications.join(", ")}
                      </span>
                    </h3>

                    <h3 className="mb-2 text-xs font-medium text-dark-6 dark:text-dark-6">
                      Languages:
                      <span className="ml-2 text-xs font-medium text-dark dark:text-white">
                        {coachSummary.languages.join(", ")}
                      </span>
                    </h3>

                    <h3 className="text-xs font-medium text-dark-6 dark:text-dark-6">
                      Experience &#40;years&#41;:
                      <span className="ml-2 text-xs font-medium text-dark dark:text-white">
                        {coachSummary.experience.match(/\d+/)?.[0] ??
                          coachSummary.experience}
                      </span>
                    </h3>
                  </div>
                </>
              }
            />
          )}
        </div>

        <DataTable
          title="Payment History"
          description="Your recent invoices, plans, and payment status."
          data={paymentHistory}
          columns={paymentHistoryColumns}
          searchPlaceholder="Search invoice..."
          initialPageSize={5}
          emptyStateLabel="No invoice available."
          className="col-span-12 lg:col-span-7"
          tableClassName="min-w-[760px]"
        />
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
            label="Request Change"
            size="small"
            toastMessage="Training plan details page not yet created."
          />
        }
      />

      <TableUI
        title="Nutrition Plan"
        description="Structured meals for training days with target macros and calories."
        data={mealPlan}
        columns={mealPlanColumns}
        rowKey={(row) => row.id}
        className="mb-8"
        tableClassName="min-w-[860px]"
        headerActions={
          <Button
            label="Request Change"
            size="small"
            toastMessage="Nutrition support request flow not yet created."
          />
        }
      />
    </div>
  );
}
