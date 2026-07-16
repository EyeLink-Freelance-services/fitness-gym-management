import type { NoticeListItem, NoticeType } from "@/types/dashboard/notice";
import type { StatusTone } from "@/types/shared";

export interface AnnouncementCardItem {
  id: string;
  noticeType: NoticeType;
  accent: StatusTone;
  title: string;
  description: string;
  eventDateTime?: string | null;
  expiresAt?: string | null;
  eventDateLabel?: string | null;
  timestampLabel?: string | null;
  expiresLabel?: string | null;
}

export interface AnnouncementCardProps {
  announcement: AnnouncementCardItem;
  onEdit?: (announcement: AnnouncementCardItem) => void;
  onDelete?: (id: string) => void | Promise<void>;
  isDeleting?: boolean;
}

export interface AnnouncementListProps {
  announcements: AnnouncementCardItem[];
  showCreate?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export function mapNoticeToCardItem(notice: NoticeListItem): AnnouncementCardItem {
  const eventDateLabel = notice.eventDateTime
    ? new Date(notice.eventDateTime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const timestampLabel = notice.postedAt
    ? `Posted ${new Date(notice.postedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : null;

  const expiresLabel = notice.expiresAt
    ? new Date(`${notice.expiresAt}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return {
    id: notice.id,
    noticeType: notice.noticeType,
    accent: notice.noticeType === "EVENT" ? "warning" : "primary",
    title: notice.title,
    description: notice.content,
    eventDateTime: notice.eventDateTime,
    expiresAt: notice.expiresAt,
    eventDateLabel,
    timestampLabel,
    expiresLabel,
  };
}
