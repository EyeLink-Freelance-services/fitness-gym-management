import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import type { ScheduledSession } from "@/types/session-scheduling";

export type BookSessionInput = {
  coachId: string;
  clientId: string | null;
  date: string;
  time: string;
  title: string;
  durationMinutes: number;
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
const DURATION_MIN = 5;
const DURATION_MAX = 12 * 60;

export function validateNewSession(
  input: BookSessionInput,
  existing: ScheduledSession[],
  options?: { excludeSessionId?: string },
): string | null {
  if (!parseCalendarDate(input.date)) {
    return "Invalid date.";
  }

  const tz = getLocalTimeZone();
  const cd = parseCalendarDate(input.date)!;
  const now = today(tz);
  if (cd.compare(now) < 0) {
    return "Cannot book sessions in the past.";
  }

  if (!TIME_RE.test(input.time)) {
    return "Invalid time.";
  }

  const title = input.title.trim();
  if (!title.length) {
    return "Add a session title.";
  }
  if (title.length > TITLE_MAX) {
    return `Title must be at most ${TITLE_MAX} characters.`;
  }

  if (
    !Number.isFinite(input.durationMinutes) ||
    input.durationMinutes < DURATION_MIN ||
    input.durationMinutes > DURATION_MAX
  ) {
    return `Duration must be between ${DURATION_MIN} and ${DURATION_MAX} minutes.`;
  }

  const duplicate = existing.some(
    (s) =>
      s.coachId === input.coachId &&
      s.date === input.date &&
      s.time === input.time &&
      s.id !== options?.excludeSessionId,
  );
  if (duplicate) {
    return "This time slot is already booked.";
  }

  return null;
}
