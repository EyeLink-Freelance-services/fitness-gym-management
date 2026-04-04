import type {
  ButtonColorVariant,
  DashboardCampaignStatus,
  StatusTone,
} from "@/types/shared";

export interface AnnouncementChannelTag {
  code: string;
  label: string;
}

export interface AnnouncementMetaItem {
  label: string;
  value: string;
}

export interface AnnouncementCardAction {
  label: string;
  variant: ButtonColorVariant;
  toastMessage: string;
}

export interface AnnouncementCardItem {
  id: string;
  accent: StatusTone;
  priority: string;
  priorityTone: StatusTone;
  audience: string;
  channels: AnnouncementChannelTag[];
  status: DashboardCampaignStatus;
  statusTone: StatusTone;
  title: string;
  description: string;
  meta: AnnouncementMetaItem[];
  timestampLabel: string;
  actions: AnnouncementCardAction[];
}

export interface AnnouncementStatusFilter {
  label: string;
  value: DashboardCampaignStatus;
  count: number;
}

export interface AnnouncementFilters {
  statuses: AnnouncementStatusFilter[];
  channels: string[];
  priorities: string[];
}

export interface AnnouncementMetricRow {
  id: string;
  title: string;
  audience?: string;
  channels?: AnnouncementChannelTag[];
  priority?: string;
  priorityTone?: StatusTone;
  status: DashboardCampaignStatus;
  statusTone: StatusTone;
  reach?: string;
  opened?: string;
  deliveryLabel?: string;
  actionLabel?: string;
  actionVariant?: ButtonColorVariant;
  actionToast?: string;
}

export interface AnnouncementCardProps {
  announcement: AnnouncementCardItem;
}

export interface AnnouncementListProps {
  announcements: AnnouncementCardItem[];
  filters: AnnouncementFilters;
}

export interface AnnouncementMetricsTableProps {
  rows: AnnouncementMetricRow[];
}

