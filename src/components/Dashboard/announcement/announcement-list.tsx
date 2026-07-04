"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { cn } from "@/lib/utils";
import type { AnnouncementListProps } from "@/types/dashboard/announcement";
import { useMemo, useState } from "react";
import { AnnouncementCard } from "./announcement-card";
import { Button } from "@/components/ui-elements/button";

const ITEMS_PER_PAGE = 4;

export function AnnouncementList({
  announcements,
  filters,
}: AnnouncementListProps) {
  const [selectedStatus, setSelectedStatus] = useState(
    filters.statuses[0]?.value ?? "All",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter((announcement) => {
        const matchesStatus =
          selectedStatus === "All"
            ? true
            : selectedStatus === "Draft"
              ? announcement.status === "Draft"
              : announcement.status === selectedStatus;

        return matchesStatus;
      }),
    [announcements, selectedStatus],
  );

  const totalPages =
    Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE) || 1;
  const paginatedAnnouncements = useMemo(
    () =>
      filteredAnnouncements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filteredAnnouncements, currentPage],
  );

  return (
    <section className="mb-8 rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Announcement
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
            Recent published and draft announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FormModalTrigger
            buttonLabel="+ New Announcement"
            formType="announcement"
            size="small"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        {filters.statuses.map((item) => {
          const isActive = selectedStatus === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setSelectedStatus(item.value);
                setCurrentPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-stroke text-dark-6 hover:border-primary/40 hover:text-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-primary/40 dark:hover:text-primary",
              )}
            >
              <span>{item.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-1 text-dark-5 dark:bg-dark-2 dark:text-dark-6",
                )}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          <>
            {paginatedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-stroke pt-4 dark:border-dark-3">
                <Button
                  label="Previous"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="transition disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="text-sm text-dark-6 dark:text-dark-6">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  label="Next"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="transition disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[14px] border border-dashed border-stroke px-6 py-10 text-center text-sm text-dark-6 dark:border-dark-3 dark:text-dark-6">
            No announcements.
          </div>
        )}
      </div>
    </section>
  );
}
