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
import { Trash2 } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import type { BookSessionInput } from "@/services/session-scheduling/validation";

function sortSessions(list: ScheduledSession[]) {
  return [...list].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });
}

function sessionLabel(
  session: ScheduledSession,
  clientLabelMap: Record<string, string>,
) {
  return clientLabelMap[session.clientId] ?? session.clientName ?? "Client";
}

type SessionSchedulingPageProps = {
  role: SessionSchedulingRole;
  viewerClientId?: string;
  clientOptions?: SessionClientOption[];
  initialSessions?: ScheduledSession[];
};

export function SessionSchedulingPage({
  role,
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
  const { visibleSessions, createSessionsBatch, deleteSession } =
    useSessionScheduling(role, initialSessions, viewerClientId);

  const [selected, setSelected] = useState<CalendarDate>(() => today(tz));
  const [activeFormDateIso, setActiveFormDateIso] = useState<string | null>(null);
  const mounted = useMounted();

  const sorted = useMemo(() => sortSessions(visibleSessions), [visibleSessions]);

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

  const onCalendarChange = (date: CalendarDate) => {
    setSelected(date);
    if (role === "coach" && date.compare(today(tz)) >= 0) {
      setActiveFormDateIso(date.toString());
    }
  };

  const todayIso = today(tz).toString();
  const sessionsToday = sorted.filter((session) => session.date === todayIso);

  const handleSave = async (inputs: BookSessionInput[]) => {
    const result = await createSessionsBatch(inputs);
    if (result.ok) return { ok: true as const };
    return { ok: false as const, error: result.error };
  };

  const handleRemoveSession = async (sessionId: string) => {
    await deleteSession(sessionId);
  };

  return (
    <div className="space-y-8">
      <DashboardSection
        title={role === "coach" ? "Session calendar" : "My sessions"}
        className="mb-0"
      >
        <p className="mb-6 max-w-2xl text-sm text-dark-6 dark:text-dark-6">
          {role === "coach"
            ? "Pick a date to add a session with a client."
            : "Sessions your coach has scheduled for you."}
        </p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full shrink-0 lg:w-[65%]">
            <SessionCalendar
              value={selected}
              onChange={onCalendarChange}
              sessions={visibleSessions}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-dark-5">
                {role === "coach" ? "Upcoming & scheduled" : "Your schedule"}
              </h3>
              <ul className="mt-2 max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
                {sorted.length === 0 ? (
                  <li className="text-xs italic text-dark-6">No sessions yet.</li>
                ) : (
                  sorted.map((session) => (
                    <li
                      key={session.id}
                      className="flex gap-1.5 rounded-lg border border-stroke px-2.5 py-2 text-xs dark:border-dark-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-dark dark:text-white text-base ">
                          {session.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-dark-6 text-[13px]">
                          <span className="font-mono">{session.date}</span>
                          <span className="font-mono">
                            {session.time} – {session.timeTo}
                          </span>
                          <span>{session.durationMinutes} min</span>
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-dark-6 text-[13px]">
                      
                          <span className="truncate text-dark dark:text-dark-6">
                            {sessionLabel(session, clientLabelMap)}
                          </span>
                        </p>
                      </div>
                      {role === "coach" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(session.id)}
                          className="shrink-0 self-start rounded-lg border border-stroke p-1.5 text-dark-6 transition hover:border-red/50 hover:bg-red/10 hover:text-red dark:border-dark-3"
                          title="Remove session"
                          aria-label={`Remove session ${session.title}`}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-dark-5">
                Today
              </h3>
              <ul className="mt-1.5 space-y-1.5">
                {sessionsToday.length === 0 ? (
                  <li className="text-xs italic text-dark-6">
                    No sessions today.
                  </li>
                ) : (
                  sessionsToday.map((session) => (
                    <li
                      key={session.id}
                      className="flex items-start gap-1.5 rounded-lg bg-gray-100 px-2.5 py-2 text-xs dark:bg-dark-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono font-semibold">
                          {session.time} – {session.timeTo}
                        </span>
                        <span className="ml-1.5 font-medium text-dark dark:text-white">
                          {session.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-dark-6">
                          {session.durationMinutes} min ·{" "}
                          {sessionLabel(session, clientLabelMap)}
                        </span>
                      </div>
                      {role === "coach" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSession(session.id)}
                          className="shrink-0 rounded-lg border border-transparent p-1 text-dark-6 transition hover:border-red/40 hover:bg-red/10 hover:text-red"
                          title="Remove session"
                          aria-label={`Remove session ${session.title}`}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
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
                  key={activeFormDateIso}
                  dateIso={activeFormDateIso}
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
