import type { AuditableApiBean } from "./shared";

export interface TrainingSessionRequestBody {
  sessionTitle: string;
  startDateTime: string;
  endDateTime: string;
}

export interface ClientTrainingSessionResponseApiBean {
  id?: string;
  trainingSessionId?: string;
  clientId?: string;
  clientName?: string;
  coachName?: string;
  sessionTitle?: string;
  title?: string;
  date?: string;
  time?: string;
  timeFrom?: string;
  timeTo?: string;
  startDateTime?: string;
  endDateTime?: string;
  status?: string;
  auditData?: AuditableApiBean;
}

export interface SearchClientTrainingSessionResponseBody {
  trainingSessions?: ClientTrainingSessionResponseApiBean[];
  clientTrainingSessions?: ClientTrainingSessionResponseApiBean[];
  content?: ClientTrainingSessionResponseApiBean[];
  sessions?: ClientTrainingSessionResponseApiBean[];
}

export type TrainingSessionQuery = {
  startDateTime?: string;
  endDateTime?: string;
  sessionTitle?: string;
  date?: string;
  yearWeek?: number;
  yearMonth?: string;
};
