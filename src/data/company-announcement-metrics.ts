import { COMPANY_ANNOUNCEMENTS } from "@/data/company-announcement";
import type { AnnouncementMetricRow } from "@/types/dashboard/announcement";
import { buildAnnouncementMetricRow } from "@/utils/dashboard/announcement";

export const COMPANY_ANNOUNCEMENT_METRICS: AnnouncementMetricRow[] =
  COMPANY_ANNOUNCEMENTS.map(buildAnnouncementMetricRow);
