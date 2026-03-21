"use client";

import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
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

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <article
      className={cn(
        "rounded-[14px] border bg-white px-5 py-5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        accentClasses[announcement.accent],
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* <StatusBadge
          label={announcement.priority}
          tone={announcement.priorityTone}
        /> */}

        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/15">
          {announcement.audience}
        </span>

        <StatusBadge
          label={announcement.status}
          tone={announcement.statusTone}
        />

        {announcement.timestampLabel ? (
          <span className="text-sm text-dark-6 dark:text-dark-6">
            {announcement.timestampLabel}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-dark dark:text-white">
          {announcement.title}
        </h3>
        <p className="mt-2 max-w-4xl text-base leading-7 text-dark-6 dark:text-dark-6">
          {announcement.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-4 xl:flex-row xl:items-center xl:justify-end">
        <div className="flex flex-wrap items-center gap-3">
          {announcement.actions.map((action) => (
            <Button
              key={`${announcement.id}-${action.label}`}
              label={action.label}
              size="small"
              variant={action.variant}
              toastMessage={action.toastMessage}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
