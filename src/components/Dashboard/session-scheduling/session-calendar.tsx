"use client";

import { cn } from "@/lib/utils";
import type { ScheduledSession } from "@/types/session-scheduling";
import {
  type CalendarDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import {
  Calendar,
  LocaleProvider,
  type CalendarProps,
} from "react-calendar-kit";

const calendarClassNames: NonNullable<CalendarProps["classNames"]> = {
  root: "w-full max-w-md rounded-xl border border-stroke bg-white p-3 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card",
  container: "w-full",
  header: "mb-3 flex items-center justify-between gap-2 px-1",
  nav: "flex items-center justify-between gap-2",
  navGroup: "flex items-center gap-2",
  previousButton:
    "flex size-9 items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3",
  nextButton:
    "flex size-9 items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3",
  month: "text-center text-sm font-semibold text-dark dark:text-white",
  gridWrapper: "overflow-x-auto",
  grid: "w-full border-collapse",
  gridHead: "",
  gridHeadRow: "",
  gridHeadCell:
    "pb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-dark-5",
  gridBody: "",
  gridBodyRow: "",
  gridBodyCell: "p-0.5 text-center align-middle",
  cellButton:
    "flex size-9 w-full items-center justify-center rounded-lg text-sm font-medium text-dark outline-none transition data-[outside-month]:text-dark-5 data-[selected]:bg-primary data-[selected]:text-white data-[today]:ring-2 data-[today]:ring-primary/40 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 hover:bg-primary/10 dark:text-white dark:data-[outside-month]:text-dark-6 dark:hover:bg-dark-3",
};

type SessionCalendarProps = {
  value: CalendarDate;
  onChange: (date: CalendarDate) => void;
  allowPastDates: boolean;
  sessions: ScheduledSession[];
};

export function SessionCalendar({
  value,
  onChange,
  allowPastDates,
  sessions,
}: SessionCalendarProps) {
  const tz = getLocalTimeZone();
  const minValue = allowPastDates ? undefined : today(tz);

  const uniqueSortedDates = [...new Set(sessions.map((s) => s.date))].sort();

  return (
    <div className="space-y-4">
      <LocaleProvider locale="en-US">
        <Calendar
          classNames={calendarClassNames}
          value={value}
          onChange={onChange}
          minValue={minValue}
          weekdayStyle="short"
        />
      </LocaleProvider>

      <div className="rounded-lg border border-stroke/80 bg-gray-100/80 px-4 py-3 dark:border-dark-3 dark:bg-dark-3/40">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dark-5">
          Days with sessions
        </p>
        {uniqueSortedDates.length === 0 ? (
          <p className="mt-1 text-sm text-dark-6">No sessions in view.</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {uniqueSortedDates.map((d) => {
              const count = sessions.filter((s) => s.date === d).length;
              const hasGeneral = sessions.some(
                (s) => s.date === d && s.clientId === null,
              );
              return (
                <li
                  key={d}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                    hasGeneral
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                      : "border-primary/30 bg-primary/10 text-primary",
                  )}
                >
                  <span className="font-mono">{d}</span>
                  <span className="text-dark-5 dark:text-dark-6">×{count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
