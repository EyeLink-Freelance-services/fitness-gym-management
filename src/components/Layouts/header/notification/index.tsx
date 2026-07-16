"use client";

import { BellIcon, Calendar } from "@/components/IconsCollection/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { fetchRecentNoticesAction } from "@/app/(app)/dashboard/company/announcement/actions";
import { ROUTES } from "@/constants/route";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { NoticeListItem } from "@/types/dashboard/notice";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function formatPostedDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRecentNoticesAction(5);
      setNotices(data);
    } catch {
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotices();
  }, [loadNotices]);

  useEffect(() => {
    if (isOpen) {
      void loadNotices();
    }
  }, [isOpen, loadNotices]);

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />
          {notices.length > 0 ? (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          ) : null}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="w-[min(20rem,calc(100vw-2rem))] max-w-[20rem] border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {isLoading && notices.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-dark-6">
              Loading…
            </li>
          ) : null}

          {!isLoading && notices.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-dark-5 dark:text-dark-6">
              No notices yet.
            </li>
          ) : null}

          {notices.map((item) => (
            <li key={item.id} role="menuitem">
              <Link
                href={ROUTES.DASHBOARD.COMPANY.NOTICES}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-10 shrink-0 place-items-center rounded-full",
                    item.noticeType === "EVENT"
                      ? "bg-[#FFA70B]/15 text-[#FFA70B]"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  <Calendar className="size-5" />
                </span>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <strong className="block truncate text-sm font-medium text-dark dark:text-white">
                    {item.title}
                  </strong>
                  {item.content ? (
                    <span className="mt-0.5 line-clamp-2 block break-all text-sm font-medium text-dark-5 dark:text-dark-6">
                      {item.content}
                    </span>
                  ) : null}
                  {item.postedAt ? (
                    <span className="mt-1 block text-xs text-dark-5 dark:text-dark-6">
                      {formatPostedDate(item.postedAt)}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={ROUTES.DASHBOARD.COMPANY.NOTICES}
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          View all announcements
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
