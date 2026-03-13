import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";
import type { PersonalCoachSessionRow } from "@/types/dashboard/personal-coach";

type Props = {
  sessions: PersonalCoachSessionRow[];
};

function formatTimeParts(date: string) {
  const time = new Date(date);

  return {
    hourMinute: time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    meridiem: time
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: true,
      })
      .split(" ")[1],
  };
}

const statusClassNames: Record<PersonalCoachSessionRow["status"], string> = {
  Done: "text-green",
  Now: "text-[#FFA70B]",
  Scheduled: "text-[#0ABEF9]",
};

export function SessionsCard({ sessions }: Props) {
  const groupedSessions = {
    Today: sessions.filter((session) => session.dayLabel === "Today"),
    Tomorrow: sessions.filter((session) => session.dayLabel === "Tomorrow"),
  };

  return (
    <div className="rounded-[10px] bg-white px-6 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Sessions
          </h2>
        </div>

        <Button
          label="+ Book"
          size="small"
          className="px-4"
          toastMessage="Booking flow not yet created"
        />
      </div>

      <div className="space-y-5">
        {Object.entries(groupedSessions).map(([label, rows]) => (
          <div
            key={label}
            className="mb-4 border-b-4 pb-8 last:mb-0 last:border-none last:pb-0"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-dark-5">
              {label}
            </p>

            <div className="space-y-4">
              {rows.map((session) => {
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
                      <p className="text-sm text-dark-6 dark:text-dark-5">
                        {session.sessionType} . {session.durationMinutes} min
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
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
