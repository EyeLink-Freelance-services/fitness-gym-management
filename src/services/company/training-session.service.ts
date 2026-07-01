import {
  backendDelete,
  backendGet,
  backendPost,
} from "@/lib/api/backend-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import {
  extractTrainingSessionsFromResponse,
  mapScheduledSessionToClientRow,
  mapScheduledSessionToUpcomingRow,
  mapTrainingSessionsToScheduled,
} from "@/modules/company/training-session.mappers";
import type { CoachUpcomingSessionRow } from "@/types/dashboard/company";
import type { ClientTrainingSessionRow } from "@/types/dashboard/client";
import type {
  TrainingSessionQuery,
  TrainingSessionRequestBody,
} from "@/types/dashboard/training-session";
import type { ScheduledSession } from "@/types/session-scheduling";

const COMPANY_API_BASE = "/api/companies";

async function requireCompanyId(): Promise<string> {
  const auth = await getAuthContext();
  const companyId = auth?.companyId;

  if (!companyId) {
    throw new Error(
      "No active company in session (missing businessId/companyId).",
    );
  }

  return companyId;
}

function buildTrainingSessionQuery(params: TrainingSessionQuery = {}) {
  const query = new URLSearchParams();

  if (params.startDateTime) query.set("startDateTime", params.startDateTime);
  if (params.endDateTime) query.set("endDateTime", params.endDateTime);
  if (params.sessionTitle) query.set("sessionTitle", params.sessionTitle);
  if (params.date) query.set("date", params.date);
  if (params.yearWeek != null) query.set("yearWeek", String(params.yearWeek));
  if (params.yearMonth) query.set("yearMonth", params.yearMonth);

  return query.toString();
}

export async function getTrainingSessions(
  params: TrainingSessionQuery = {},
): Promise<ScheduledSession[]> {
  const query = buildTrainingSessionQuery(params);
  const path = query
    ? `${COMPANY_API_BASE}/training-sessions?${query}`
    : `${COMPANY_API_BASE}/training-sessions`;

  const data = await backendGet<unknown>(path);
  return mapTrainingSessionsToScheduled(extractTrainingSessionsFromResponse(data));
}

export async function getClientTrainingSessionRows(
  clientId: string,
  coachName?: string,
): Promise<ClientTrainingSessionRow[]> {
  const sessions = await getTrainingSessions();

  return sessions
    .filter((session) => session.clientId === clientId)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .map((session) => mapScheduledSessionToClientRow(session, coachName));
}

export async function getCoachUpcomingTrainingSessions(
  limit = 5,
): Promise<CoachUpcomingSessionRow[]> {
  const sessions = await getTrainingSessions();
  const now = Date.now();

  return sessions
    .filter((session) => new Date(session.startDateTime).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime(),
    )
    .slice(0, limit)
    .map((session) => mapScheduledSessionToUpcomingRow(session));
}

export async function createTrainingSession(
  clientId: string,
  body: TrainingSessionRequestBody,
) {
  const companyId = await requireCompanyId();

  await backendPost(
    `${COMPANY_API_BASE}/${companyId}/client/${clientId}/training-sessions`,
    body,
  );
}

export async function deleteTrainingSession(
  clientId: string,
  trainingSessionId: string,
) {
  const companyId = await requireCompanyId();

  await backendDelete(
    `${COMPANY_API_BASE}/${companyId}/client/${clientId}/training-sessions/${trainingSessionId}`,
  );
}
