import type { AnnouncementCardItem } from "@/types/dashboard/announcement";
import type { TableUIColumn } from "@/types/shared";

export const announcementColumns: TableUIColumn<AnnouncementCardItem>[] = [
  {
    key: "title",
    label: "Title",
    align: "left",
    headClassName: "min-w-[200px]",
  },
  {
    key: "noticeType",
    label: "Type",
    align: "left",
    render: (row) =>
      row.noticeType === "EVENT" ? "Event" : "Announcement",
    headClassName: "min-w-[120px]",
  },
  {
    key: "timestampLabel",
    label: "Posted",
    align: "left",
    render: (row) => row.timestampLabel?.replace(/^Posted\s+/, "") ?? "—",
    headClassName: "min-w-[140px]",
  },
];
