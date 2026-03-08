import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { MembershipMemberDistributionChart } from "@/components/Dashboard/membership/membership-member-distribution-chart";
import { MembershipPlanCatalog } from "@/components/Dashboard/membership/membership-plan-catalog";
import { MembershipPlanRevenueChart } from "@/components/Dashboard/membership/membership-plan-revenue-chart";
import { MembershipPromotionsTable } from "@/components/Dashboard/membership/membership-promotions-table";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { PeriodPicker } from "@/components/period-picker";
import {
  getCompanyMembershipDistribution,
  getCompanyMembershipOverviewData,
  getCompanyMembershipPlans,
  getCompanyMembershipPromotions,
  getCompanyMembershipRevenue,
} from "@/services/dashboard.services";
import { SearchType } from "@/types/dashboard";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

export default async function CompanyMembershipPage({
  searchParams,
}: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const selectedRevenueTimeFrame =
    extractTimeFrame("membership_revenue")?.split(":")[1] || "this month";

  const [overviewCards, plans, revenue, distribution, promotions] =
    await Promise.all([
      getCompanyMembershipOverviewData(),
      getCompanyMembershipPlans(),
      getCompanyMembershipRevenue(selectedRevenueTimeFrame),
      getCompanyMembershipDistribution(selectedRevenueTimeFrame),
      getCompanyMembershipPromotions(),
    ]);

  return (
    <div>
      <DashboardSection title="Membership Plans Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((item) => (
            <div key={item.label} className="space-y-1">
              <OverviewCard
                label={item.label}
                data={{
                  value: item.value,
                  growthRate: item.trend,
                }}
                Icon={item.Icon}
              />
              <p className="px-2 text-sm text-dark-6 dark:text-dark-5">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </DashboardSection>

      <MembershipPlanCatalog plans={plans} />

      <div className="mb-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <section className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                Plan Revenue Breakdown
              </h2>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
                Monthly revenue contribution by plan.
              </p>
            </div>

            <PeriodPicker
              defaultValue={selectedRevenueTimeFrame}
              items={["this month", "this quarter"]}
              sectionKey="membership_revenue"
            />
          </div>

          <MembershipPlanRevenueChart data={revenue} />
        </section>

        <section className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
          <div className="mb-4">
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
              Member Distribution
            </h2>
            <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
              Active member split across plans.
            </p>
          </div>

          <MembershipMemberDistributionChart data={distribution} />
        </section>
      </div>

      <MembershipPromotionsTable rows={promotions} />
    </div>
  );
}
