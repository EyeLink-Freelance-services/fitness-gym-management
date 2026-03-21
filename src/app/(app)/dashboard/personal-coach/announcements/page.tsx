import { AnnouncementList } from "@/components/Dashboard/announcement/announcement-list";
import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import {
  getCompanyAnnouncementFilters,
  getCompanyAnnouncementMetrics,
  getCompanyAnnouncementOverviewData,
  getCompanyAnnouncements,
} from "@/services/dashboard.services";

export default async function PersonalCoachAnnouncementPage() {
  const [overviewCards, announcements, filters, metrics] = await Promise.all([
    getCompanyAnnouncementOverviewData(),
    getCompanyAnnouncements(),
    getCompanyAnnouncementFilters(),
    getCompanyAnnouncementMetrics(),
  ]);

  return (
    <div>
      <DashboardSection title="Announcements Overview">
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
              {/* <p className="px-2 text-sm text-dark-6 dark:text-dark-6">
                {item.note}
              </p> */}
            </div>
          ))}
        </div>
      </DashboardSection>

      <AnnouncementList announcements={announcements} filters={filters} />

      {/* <AnnouncementMetricsTable rows={metrics} /> */}
    </div>
  );
}
