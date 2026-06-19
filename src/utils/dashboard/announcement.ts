import type {
  AnnouncementCardItem,
  AnnouncementMetaItem,
  AnnouncementMetricRow,
} from "@/types/dashboard/announcement";

function getAnnouncementMetaValue(meta: AnnouncementMetaItem[], label: string) {
  return meta.find((item) => item.label === label)?.value;
}

export function buildAnnouncementMetricRow(
  announcement: AnnouncementCardItem,
): AnnouncementMetricRow {
  return {
    id: announcement.id,
    title: announcement.title,
    audience: announcement.audience,
    channels: announcement.channels,
    priority: announcement.priority,
    priorityTone: announcement.priorityTone,
    status: announcement.status,
    statusTone: announcement.statusTone,
    reach:
      getAnnouncementMetaValue(announcement.meta, "Sent") ??
      getAnnouncementMetaValue(announcement.meta, "Target") ??
      "-",
    opened: getAnnouncementMetaValue(announcement.meta, "Opened") ?? "-",
    deliveryLabel:
      getAnnouncementMetaValue(announcement.meta, "Sends") ??
      announcement.timestampLabel ??
      announcement.meta[0]?.value ??
      "-",
    actionLabel:
      announcement.actions[0]?.label ??
      (announcement.status === "Published" ? "Insights" : "View"),
    actionVariant: announcement.actions[0]?.variant ?? "outlineDark",
    actionToast:
      announcement.actions[0]?.toastMessage ??
      "Announcement insights are not connected yet.",
  };
}
