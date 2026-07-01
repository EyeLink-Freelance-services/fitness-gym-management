"use client";

import { cn } from "@/lib/utils";
import type { ScheduledSession } from "@/types/session-scheduling";
import {
  type CalendarDate,
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LOCALE = "en-GB";

const DAY_CELL_HEIGHT = "4.5rem";
const CALENDAR_WIDTH = "100%";

function groupSessionsByDate(sessions: ScheduledSession[]) {
  const map = new Map<string, ScheduledSession[]>();
  for (const session of sessions) {
    const list = map.get(session.date) ?? [];
    list.push(session);
    map.set(session.date, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.time.localeCompare(b.time));
  }
  return map;
}

function buildMonthGrid(viewMonth: CalendarDate): CalendarDate[] {
  const start = startOfWeek(startOfMonth(viewMonth), LOCALE);
  const end = endOfWeek(endOfMonth(viewMonth), LOCALE);
  const days: CalendarDate[] = [];
  let cursor = start;
  while (cursor.compare(end) <= 0) {
    days.push(cursor);
    cursor = cursor.add({ days: 1 });
  }
  return days;
}

type SessionCalendarProps = {
  value: CalendarDate;
  onChange: (date: CalendarDate) => void;
  sessions: ScheduledSession[];
};

export function SessionCalendar({
  value,
  onChange,
  sessions,
}: SessionCalendarProps) {
  const tz = getLocalTimeZone();
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  const sessionsByDate = useMemo(() => groupSessionsByDate(sessions), [sessions]);
  const days = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const monthLabel = useMemo(() => {
    const jsDate = new Date(viewMonth.year, viewMonth.month - 1, 1);
    return jsDate.toLocaleDateString(LOCALE, { month: "long", year: "numeric" });
  }, [viewMonth]);

  const selectDate = (date: CalendarDate) => {
    onChange(date);
    if (!isSameMonth(date, viewMonth)) {
      setViewMonth(startOfMonth(date));
    }
  };

  return (
    <div
      className="self-start overflow-visible rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
      style={{ width: CALENDAR_WIDTH, padding: "0.75rem 1rem" }}
    >
      <div
        className="flex items-center justify-between gap-2"
        style={{ marginBottom: "0.5rem", paddingInline: "0.25rem" }}
      >
        <button
          type="button"
          onClick={() => setViewMonth(viewMonth.subtract({ months: 1 }))}
          className="flex items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          style={{ width: "2.25rem", height: "2.25rem" }}
          aria-label="Previous month"
        >
          <ChevronLeft style={{ width: "1rem", height: "1rem" }} aria-hidden />
        </button>
        <p
          className="font-semibold text-dark dark:text-white"
          style={{ fontSize: "0.875rem" }}
        >
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth(viewMonth.add({ months: 1 }))}
          className="flex items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          style={{ width: "2.25rem", height: "2.25rem" }}
          aria-label="Next month"
        >
          <ChevronRight style={{ width: "1rem", height: "1rem" }} aria-hidden />
        </button>
      </div>

      <div
        className="grid grid-cols-7 overflow-visible"
        style={{ gap: "0.25rem" }}
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center font-semibold uppercase tracking-wider text-dark-5"
            style={{ paddingBottom: "0.25rem", fontSize: "0.75rem" }}
          >
            {label}
          </div>
        ))}

        {days.map((date) => {
          const iso = date.toString();
          const daySessions = sessionsByDate.get(iso) ?? [];
          const hasSessions = daySessions.length > 0;
          const isSelected = value.toString() === iso;
          const inMonth = isSameMonth(date, viewMonth);
          const isTodayDate = isToday(date, tz);

          return (
            <div
              key={iso}
              className="overflow-visible text-center"
              style={{ padding: "0.125rem" }}
            >
              <button
                type="button"
                onClick={() => selectDate(date)}
                className={cn(
                  "group relative flex w-full items-center justify-center rounded-lg font-medium outline-none transition",
                  inMonth ? "text-dark dark:text-white" : "text-dark-5 dark:text-dark-6",
                  isSelected && "bg-primary text-white",
                  !isSelected && "hover:bg-primary/10 dark:hover:bg-dark-3",
                  isTodayDate && !isSelected && "ring-2 ring-primary/40",
                  hasSessions && "border-2 border-primary",
                  hasSessions && isSelected && "border-white/70",
                )}
                style={{ height: DAY_CELL_HEIGHT, fontSize: "0.75rem" }}
              >
                {date.day}
                {hasSessions && (
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 group-hover:block"
                    style={{ bottom: "100%", marginBottom: "0.375rem", minWidth: "11rem" }}
                  >
                    <div
                      className="rounded-lg border border-stroke bg-white text-left shadow-lg dark:border-dark-3 dark:bg-dark-2"
                      style={{ padding: "0.5rem 0.625rem" }}
                    >
                      {daySessions.map((session) => (
                        <p
                          key={session.id}
                          className="truncate text-dark dark:text-white"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <span className="font-mono font-medium">
                            {session.time}–{session.timeTo}
                          </span>
                          <span className="ml-1.5 text-dark-6">{session.title}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
