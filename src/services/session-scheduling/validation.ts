import { CalendarDate, getLocalTimeZone, now, today } from "@internationalized/date";
import type { ScheduledSession } from "@/types/session-scheduling";

export type BookSessionInput = {
  clientId: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  title: string;
};

function parseCalendarDate(isoDay: string): CalendarDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new CalendarDate(y, mo, d);
}

/** HH:mm 24h */
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const TITLE_MAX = 120;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timesOverlap(
  fromA: string,
  toA: string,
  fromB: string,
  toB: string,
): boolean {
  const startA = timeToMinutes(fromA);
  const endA = timeToMinutes(toA);
  const startB = timeToMinutes(fromB);
  const endB = timeToMinutes(toB);
  return startA < endB && startB < endA;
}

export function validateNewSession(
  input: BookSessionInput,
  existing: ScheduledSession[],
  options?: { excludeSessionId?: string },
): string | null {
  if (!input.clientId) {
    return "Select a client.";
  }

  if (!parseCalendarDate(input.date)) {
    return "Invalid date.";
  }

  const tz = getLocalTimeZone();
  const cd = parseCalendarDate(input.date)!;
  const currentDate = today(tz);
  if (cd.compare(currentDate) < 0) {
    return "Cannot book sessions in the past.";
  }

  if (!TIME_RE.test(input.timeFrom) || !TIME_RE.test(input.timeTo)) {
    return "Invalid time.";
  }

  if (cd.compare(currentDate) === 0) {
    const current = now(tz);
    const currentMinutes = current.hour * 60 + current.minute;
    if (timeToMinutes(input.timeFrom) < currentMinutes) {
      return "Cannot book sessions in the past.";
    }
  }

  if (timeToMinutes(input.timeTo) <= timeToMinutes(input.timeFrom)) {
    return "End time must be after start time.";
  }

  const title = input.title.trim();
  if (!title.length) {
    return "Add a session title.";
  }
  if (title.length > TITLE_MAX) {
    return `Title must be at most ${TITLE_MAX} characters.`;
  }

  const conflict = existing.some(
    (s) =>
      s.id !== options?.excludeSessionId &&
      s.date === input.date &&
      timesOverlap(input.timeFrom, input.timeTo, s.time, s.timeTo),
  );
  if (conflict) {
    return "This time overlaps with an existing session.";
  }

  return null;
}
