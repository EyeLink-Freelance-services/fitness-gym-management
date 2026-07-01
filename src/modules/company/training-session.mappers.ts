import type { CoachUpcomingSessionRow } from "@/types/dashboard/company";
import type { ClientTrainingSessionRow } from "@/types/dashboard/client";
import type {
  ClientTrainingSessionResponseApiBean,
  SearchClientTrainingSessionResponseBody,
} from "@/types/dashboard/training-session";
import type { ScheduledSession } from "@/types/session-scheduling";

function toLocalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toLocalTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "00:00";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function durationMinutes(startDateTime: string, endDateTime: string): number {
  const start = new Date(startDateTime).getTime();
  const end = new Date(endDateTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.round((end - start) / 60000);
}

function buildDateTime(date: string, time: string): string {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}`;
}

export function extractTrainingSessionsFromResponse(
  data: unknown,
): ClientTrainingSessionResponseApiBean[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as SearchClientTrainingSessionResponseBody;

  return (
    record.trainingSessions ??
    record.clientTrainingSessions ??
    record.content ??
    record.sessions ??
    []
  );
}

export function getTrainingSessionStatus(startDateTime: string): string {
  const start = new Date(startDateTime);
  if (Number.isNaN(start.getTime())) return "Upcoming";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sessionDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );

  if (sessionDay.getTime() === today.getTime()) return "Today";
  if (start > now) return "Upcoming";
  return "Past";
}

export function mapTrainingSessionToScheduled(
  session: ClientTrainingSessionResponseApiBean,
): ScheduledSession | null {
  const clientId = session.clientId;
  const title = (session.sessionTitle ?? session.title)?.trim();
  const startDateTime =
    session.startDateTime ??
    (session.date && (session.timeFrom ?? session.time)
      ? buildDateTime(session.date, session.timeFrom ?? session.time!)
      : undefined);
  const endDateTime =
    session.endDateTime ??
    (session.date && session.timeTo
      ? buildDateTime(session.date, session.timeTo)
      : undefined);

  if (!clientId || !title || !startDateTime || !endDateTime) {
    return null;
  }

  const id =
    session.trainingSessionId ??
    session.id ??
    `${clientId}-${startDateTime}`;

  return {
    id,
    clientId,
    clientName: session.clientName,
    coachName: session.coachName,
    date: session.date ?? toLocalDate(startDateTime),
    startDateTime,
    endDateTime,
    time: session.timeFrom ?? session.time ?? toLocalTime(startDateTime),
    timeTo: session.timeTo ?? toLocalTime(endDateTime),
    title,
    durationMinutes: durationMinutes(startDateTime, endDateTime),
    status: session.status ?? getTrainingSessionStatus(startDateTime),
  };
}

export function mapTrainingSessionsToScheduled(
  sessions: ClientTrainingSessionResponseApiBean[],
): ScheduledSession[] {
  return sessions
    .map(mapTrainingSessionToScheduled)
    .filter((session): session is ScheduledSession => session !== null);
}

export function mapScheduledSessionToUpcomingRow(
  session: ScheduledSession,
  clientLabel?: string,
): CoachUpcomingSessionRow {
  return {
    id: session.id,
    session: session.title,
    clientName: clientLabel ?? session.clientName ?? "Client",
    startsAt: session.startDateTime,
    durationMinutes: session.durationMinutes,
    status: session.status ?? getTrainingSessionStatus(session.startDateTime),
  };
}

export function mapScheduledSessionToClientRow(
  session: ScheduledSession,
  coachName?: string,
): ClientTrainingSessionRow {
  return {
    id: session.id,
    coachName: session.coachName ?? coachName ?? "-",
    sessionTitle: session.title,
    date: session.date,
    timeFrom: session.time,
    timeTo: session.timeTo,
  };
}

export function buildTrainingSessionRequest(
  title: string,
  date: string,
  timeFrom: string,
  timeTo: string,
) {
  return {
    sessionTitle: title.trim(),
    startDateTime: buildDateTime(date, timeFrom),
    endDateTime: buildDateTime(date, timeTo),
  };
}
