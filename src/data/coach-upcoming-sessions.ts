import type { CoachUpcomingSessionRow } from "@/types/dashboard/company";

export const coachUpcomingSessions: CoachUpcomingSessionRow[] = [
  {
    id: "sess-1",
    session: "Strength Training",
    clientName: "Alex Rivera",
    startsAt: "2026-03-13T21:00:00",
    durationMinutes: 60,
    status: "Today",
  },
  {
    id: "sess-2",
    session: "Upper Body Push",
    clientName: "Jordan Lee",
    startsAt: "2026-03-17T13:00:00",
    durationMinutes: 60,
    status: "Upcoming",
  },
];
