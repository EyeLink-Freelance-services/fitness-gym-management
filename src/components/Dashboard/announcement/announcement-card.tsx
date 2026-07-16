"use client";

import {
  Calendar,
  PencilSquareIcon,
  TrashIcon,
} from "@/components/IconsCollection/icons";
import { cn } from "@/lib/utils";
import type { AnnouncementCardProps } from "@/types/dashboard/announcement";
import { StatusTone } from "@/types/shared";

const accentClasses: Record<StatusTone, string> = {
  success: "border-green/60 border-l-4 border-l-green dark:border-green/40",
  danger: "border-red/60 border-l-4 border-l-red dark:border-red/40",
  primary:
    "border-primary/40 border-l-4 border-l-primary dark:border-primary/30",
  warning:
    "border-[#FFA70B]/50 border-l-4 border-l-[#FFA70B] dark:border-[#FFA70B]/35",
  neutral: "border-dark/20 border-l-4 border-l-dark dark:border-white/10",
};

export function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
  isDeleting,
}: AnnouncementCardProps) {
  const typeLabel =
    announcement.noticeType === "EVENT" ? "Event" : "Announcement";
  const showActions = Boolean(onEdit || onDelete);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[14px] border bg-white px-5 py-5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        accentClasses[announcement.accent],
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            announcement.noticeType === "EVENT"
              ? "bg-[#FFA70B]/15 text-[#FFA70B]"
              : "bg-primary/10 text-primary dark:bg-primary/15",
          )}
        >
          <Calendar className="size-3.5" />
          {typeLabel}
        </span>

        {showActions ? (
          <div className="flex items-center gap-1">
            {onEdit ? (
              <button
                type="button"
                aria-label={`Edit ${typeLabel.toLowerCase()}`}
                disabled={isDeleting}
                onClick={() => onEdit(announcement)}
                className="rounded-lg p-2 text-dark-6 transition hover:bg-gray-2 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                <PencilSquareIcon className="size-4" />
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                aria-label={`Delete ${typeLabel.toLowerCase()}`}
                disabled={isDeleting}
                onClick={() => void onDelete(announcement.id)}
                className="rounded-lg p-2 text-red transition hover:bg-red/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TrashIcon className="size-4" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="min-w-0 overflow-hidden">
        <h3 className="break-words text-xl font-semibold text-dark dark:text-white">
          {announcement.title}
        </h3>
        {announcement.description ? (
          <p className="mt-2 max-w-full break-all text-base leading-7 text-dark-6 dark:text-dark-6">
            {announcement.description}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-dark-6 dark:text-dark-6">
        {announcement.eventDateLabel ? (
          <p className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" />
            {announcement.eventDateLabel}
          </p>
        ) : null}
        {announcement.timestampLabel ? (
          <p className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" />
            {announcement.timestampLabel}
          </p>
        ) : null}
        {announcement.expiresLabel ? (
          <p className="flex items-center gap-2">
            Expires {announcement.expiresLabel}
          </p>
        ) : null}
      </div>
    </article>
  );
}
