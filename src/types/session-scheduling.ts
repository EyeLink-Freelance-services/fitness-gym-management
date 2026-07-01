export type ScheduledSession = {
  id: string;
  clientId: string;
  clientName?: string;
  coachName?: string;
  date: string;
  startDateTime: string;
  endDateTime: string;
  time: string;
  timeTo: string;
  title: string;
  durationMinutes: number;
  status?: string;
};

export type SessionClientOption = {
  id: string;
  label: string;
};

export type SessionSchedulingRole = "coach" | "client";
