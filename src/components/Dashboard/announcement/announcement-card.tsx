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
        <StatusBadge
          label={announcement.priority}
          tone={announcement.priorityTone}
        />

        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/15">
          {announcement.audience}
        </span>

        <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-stroke px-2 py-1 dark:border-dark-3">
          {announcement.channels.map((channel) => (
            <span
              key={`${announcement.id}-${channel.code}`}
              className="inline-flex rounded-full bg-gray-1 px-2 py-0.5 text-[11px] font-semibold tracking-[0.16em] text-dark-5 dark:bg-dark-2 dark:text-dark-5"
              title={channel.label}
            >
              {channel.code}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-dark dark:text-white">
          {announcement.title}
        </h3>
        <p className="mt-2 max-w-4xl text-base leading-7 text-dark-6 dark:text-dark-5">
          {announcement.description}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-stroke pt-4 dark:border-dark-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {announcement.meta.map((item) => (
            <div
              key={`${announcement.id}-${item.label}`}
              className="flex items-center gap-2"
            >
              <span className="size-2 rounded-full bg-primary/60" />
              <p className="text-sm text-dark-6 dark:text-dark-5">
                <span className="font-semibold text-dark dark:text-white">
                  {item.value}
                </span>{" "}
                {item.label.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            label={announcement.status}
            tone={announcement.statusTone}
          />

          {announcement.timestampLabel ? (
            <span className="text-sm text-dark-6 dark:text-dark-5">
              {announcement.timestampLabel}
            </span>
          ) : null}

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
