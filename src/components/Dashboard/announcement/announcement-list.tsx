"use client";

import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";
import type { AnnouncementListProps } from "@/types/dashboard/announcement";
import { useMemo, useState } from "react";
import { AnnouncementCard } from "./announcement-card";

const filterInputClasses =
  "h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white";

export function AnnouncementList({
  announcements,
  filters,
}: AnnouncementListProps) {
  const [selectedStatus, setSelectedStatus] = useState(
    filters.statuses[0]?.value ?? "All",
  );
  const [selectedAudience, setSelectedAudience] = useState(
    filters.audiences[0] ?? "All Audiences",
  );
  const [selectedChannel, setSelectedChannel] = useState(
    filters.channels[0] ?? "All Channels",
  );
  const [selectedPriority, setSelectedPriority] = useState(
    filters.priorities[0] ?? "All Priorities",
  );

  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter((announcement) => {
        const matchesStatus =
          selectedStatus === "All"
            ? true
            : selectedStatus === "Draft"
              ? announcement.status === "Draft"
              : announcement.status === selectedStatus;

        const matchesAudience =
          selectedAudience === "All Audiences"
            ? true
            : announcement.audience === selectedAudience;

        const matchesChannel =
          selectedChannel === "All Channels"
            ? true
            : announcement.channels.some(
                (channel) => channel.label === selectedChannel,
              );

        const matchesPriority =
          selectedPriority === "All Priorities"
            ? true
            : announcement.priority === selectedPriority;

        return (
          matchesStatus && matchesAudience && matchesChannel && matchesPriority
        );
      }),
    [
      announcements,
      selectedAudience,
      selectedChannel,
      selectedPriority,
      selectedStatus,
    ],
  );

  return (
    <section className="mb-8 rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Campaign Queue
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
            Recent published, scheduled, and draft announcements.
          </p>
        </div>

        <Button
          label="+ New Announcement"
          size="small"
          toastMessage="Announcement composer is not connected yet."
        />
      </div>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          {filters.statuses.map((item) => {
            const isActive = selectedStatus === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedStatus(item.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-stroke text-dark-6 hover:border-primary/40 hover:text-primary dark:border-dark-3 dark:text-dark-5 dark:hover:border-primary/40 dark:hover:text-primary",
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-1 text-dark-5 dark:bg-dark-2 dark:text-dark-5",
                  )}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={selectedAudience}
            onChange={(event) => setSelectedAudience(event.target.value)}
            className={filterInputClasses}
          >
            {filters.audiences.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={selectedChannel}
            onChange={(event) => setSelectedChannel(event.target.value)}
            className={filterInputClasses}
          >
            {filters.channels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(event) => setSelectedPriority(event.target.value)}
            className={filterInputClasses}
          >
            {filters.priorities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))
        ) : (
          <div className="rounded-[14px] border border-dashed border-stroke px-6 py-10 text-center text-sm text-dark-6 dark:border-dark-3 dark:text-dark-5">
            No announcements match the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}
