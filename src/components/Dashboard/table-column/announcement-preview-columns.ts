import type { AnnouncementCardItem } from "@/types/dashboard/announcement";
import type { TableUIColumn } from "@/types/shared";

export const announcementColumns: TableUIColumn<AnnouncementCardItem>[] = [
  {
    key: "title",
    label: "Announcement",
    align: "left",
    headClassName: "min-w-[240px]",
  },
  {
    key: "audience",
    label: "Audience",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "timestampLabel",
    label: "Publish Date",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => row.status,
    headClassName: "min-w-[120px]",
  },
];
