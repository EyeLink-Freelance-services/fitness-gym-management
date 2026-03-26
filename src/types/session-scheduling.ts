export type ScheduledSession = {
  id: string;
  coachId: string;
  clientId: string | null;
  date: string;
  time: string;
  title: string;
  durationMinutes: number;
};

export type SessionClientOption = {
  id: string;
  label: string;
};

export type SessionSchedulingRole = "coach" | "client";
