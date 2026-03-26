import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import { statusClassNames } from "@/data/personal-coach-schema";
import { cn } from "@/lib/utils";
import type { PersonalCoachSessionProps } from "@/types/dashboard/personal-coach";
import { formatTimeParts } from "@/utils/dashboard/shared";
import Link from "next/link";
import CardTitle from "../overview-cards/cardTitle";

export function SessionsCard({ sessions }: PersonalCoachSessionProps) {
  const groupedSessions = {
    Today: sessions
      .filter((session) => session.dayLabel === "Today")
      .slice(0, 2),
    Tomorrow: sessions
      .filter((session) => session.dayLabel === "Tomorrow")
      .slice(0, 2),
  };

  return (
    <div className="rounded-[10px] bg-white px-6 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <CardTitle title="Sessions" />
        </div>

        <Link href={ROUTES.DASHBOARD.PERSONAL_COACH.SESSIONS}>
          <Button label="Manage" size="small" className="px-4" />
        </Link>
      </div>

      <div className="space-y-5">
        {Object.entries(groupedSessions).map(([label, rows]) => (
          <div
            key={label}
            className="mb-8 border-b-4 pb-8 last:mb-0 last:border-none last:pb-0"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-dark-5">
              {label}
            </p>

            <div className="space-y-4">
              {rows.length === 0 ? (
                <p className="text-sm italic text-dark-5">No sessions</p>
              ) : (
                rows.map((session) => {
                  const time = formatTimeParts(session.startsAt);

                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 border-b border-stroke pb-4 last:border-b-0 last:pb-0 dark:border-dark-3"
                    >
                      <div className="min-w-[58px] text-center">
                        <p className="text-lg font-bold text-primary">
                          {time.hourMinute}
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-dark-5">
                          {time.meridiem}
                        </p>
                      </div>

                      <div className="h-10 w-px bg-stroke dark:bg-dark-3" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-dark dark:text-white">
                          {session.clientName}
                        </p>
                        <p className="text-sm text-dark-6 dark:text-dark-6">
                          {session.sessionType} · {session.durationMinutes} min
                        </p>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 text-sm font-medium",
                          statusClassNames[session.status],
                        )}
                      >
                        {session.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
