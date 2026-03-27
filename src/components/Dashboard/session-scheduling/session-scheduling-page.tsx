"use client";

import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { SessionCalendar } from "@/components/Dashboard/session-scheduling/session-calendar";
import { SessionForm } from "@/components/Dashboard/session-scheduling/session-form";
import { useSessionScheduling } from "@/hooks/use-session-scheduling";
import type {
  ScheduledSession,
  SessionClientOption,
  SessionSchedulingRole,
} from "@/types/session-scheduling";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import { Trash2 } from "lucide-react";

function sortSessions(list: ScheduledSession[]) {
  return [...list].sort((a, b) => {
    const da = a.date.localeCompare(b.date);
    if (da !== 0) return da;
    return a.time.localeCompare(b.time);
  });
}

function sessionLabel(
  s: ScheduledSession,
  clientLabelMap: Record<string, string>,
) {
  if (s.clientId === null) return "General (open)";
  return clientLabelMap[s.clientId] ?? s.clientId;
}

type SessionSchedulingPageProps = {
  role: SessionSchedulingRole;
  coachId?: string;
  viewerClientId?: string;
  clientOptions?: SessionClientOption[];
  initialSessions?: ScheduledSession[];
};

export function SessionSchedulingPage({
  role,
  coachId = "",
  viewerClientId,
  clientOptions = [],
  initialSessions = [],
}: SessionSchedulingPageProps) {
  const tz = getLocalTimeZone();
  const clientLabelMap = useMemo(
    () =>
      Object.fromEntries(
        clientOptions.map((client) => [client.id, client.label]),
      ),
    [clientOptions],
  );
  const {
    visibleSessions,
    createSessionsBatch,
    deleteSession,
  } = useSessionScheduling(role, initialSessions, clientOptions, viewerClientId);

  const [selected, setSelected] = useState<CalendarDate>(() => today(tz));
  const [activeFormDateIso, setActiveFormDateIso] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const sorted = useMemo(() => sortSessions(visibleSessions), [visibleSessions]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeFormDateIso) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveFormDateIso(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeFormDateIso]);

  const onCalendarChange = (d: CalendarDate) => {
    setSelected(d);
    const iso = d.toString();
    if (role === "coach") {
      setActiveFormDateIso(iso);
    }
  };

  const sessionsOnSelectedDay = sorted.filter((s) => s.date === selected.toString());

  const handleSave = (inputs: BookSessionInput[]) => {
    const result = createSessionsBatch(inputs);
    if (result.ok) return { ok: true as const };
    return { ok: false as const, error: result.error };
  };

  const handleRemoveSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  return (
    <div className="space-y-8">
      <DashboardSection
        title={role === "coach" ? "Session calendar" : "My sessions"}
        className="mb-0"
      >
        <p className="mb-6 max-w-2xl text-sm text-dark-6 dark:text-dark-6">
          {role === "coach"
            ? "Pick a date to add a session. Use Remove to cancel a session. Weekly repeat adds the same slot for several weeks."
            : "Sessions your coach has scheduled for you."}
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <SessionCalendar
            value={selected}
            onChange={onCalendarChange}
            allowPastDates={role === "client"}
            sessions={visibleSessions}
          />

          <div className="min-w-0 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-dark-5">
                {role === "coach" ? "Upcoming & scheduled" : "Your schedule"}
              </h3>
              <ul className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {sorted.length === 0 ? (
                  <li className="text-sm italic text-dark-6">No sessions yet.</li>
                ) : (
                  sorted.map((s) => (
                    <li
                      key={s.id}
                      className="flex gap-2 rounded-lg border border-stroke px-3 py-2.5 text-sm dark:border-dark-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-dark dark:text-white">
                          {s.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-dark-6">
                          <span className="font-mono">{s.date}</span>
                          <span className="font-mono">{s.time}</span>
                          <span>{s.durationMinutes} min</span>
                          <span className="text-dark dark:text-dark-6">
                            {sessionLabel(s, clientLabelMap)}
                          </span>
                        </p>
                      </div>
                      {role === "coach" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(s.id)}
                          className="shrink-0 self-start rounded-lg border border-stroke p-2 text-dark-6 transition hover:border-red/50 hover:bg-red/10 hover:text-red dark:border-dark-3"
                          title="Remove session"
                          aria-label={`Remove session ${s.title}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-dark-5">
                On {selected.toString()}
              </h3>
              <ul className="mt-2 space-y-2">
                {sessionsOnSelectedDay.length === 0 ? (
                  <li className="text-sm italic text-dark-6">
                    No sessions on this day.
                  </li>
                ) : (
                  sessionsOnSelectedDay.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-start gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-dark-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono font-semibold">{s.time}</span>
                        <span className="ml-2 font-medium text-dark dark:text-white">
                          {s.title}
                        </span>
                        <span className="ml-2 text-dark-6">
                          ({s.durationMinutes} min · {sessionLabel(s, clientLabelMap)})
                        </span>
                      </div>
                      {role === "coach" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(s.id)}
                          className="shrink-0 rounded-lg border border-transparent p-1.5 text-dark-6 transition hover:border-red/40 hover:bg-red/10 hover:text-red"
                          title="Remove session"
                          aria-label={`Remove session ${s.title}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </DashboardSection>

      {role === "coach" &&
        activeFormDateIso &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setActiveFormDateIso(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <SessionForm
                  dateIso={activeFormDateIso}
                  coachId={coachId}
                  clientOptions={clientOptions}
                  onCancel={() => setActiveFormDateIso(null)}
                  onSave={handleSave}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
