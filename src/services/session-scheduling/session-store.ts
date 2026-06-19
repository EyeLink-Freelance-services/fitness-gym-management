import type {
  ScheduledSession,
  SessionClientOption,
} from "@/types/session-scheduling";
import { validateNewSession, type BookSessionInput } from "./validation";

export function isClientAssignedToCoach(
  clientId: string,
  clientOptions: SessionClientOption[],
): boolean {
  return clientOptions.some((client) => client.id === clientId);
}

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function addSession(
  sessions: ScheduledSession[],
  input: BookSessionInput,
  clientOptions: SessionClientOption[],
): { ok: true; sessions: ScheduledSession[] } | { ok: false; error: string } {
  const err = validateNewSession(input, sessions);
  if (err) return { ok: false, error: err };

  if (
    input.clientId !== null &&
    !isClientAssignedToCoach(input.clientId, clientOptions)
  ) {
    return { ok: false, error: "Selected client is not available." };
  }

  const next: ScheduledSession = {
    id: createSessionId(),
    coachId: input.coachId,
    clientId: input.clientId,
    date: input.date,
    time: input.time,
    title: input.title.trim(),
    durationMinutes: Math.round(input.durationMinutes),
  };
  return { ok: true, sessions: [...sessions, next] };
}

export function addSessionsBatch(
  sessions: ScheduledSession[],
  inputs: BookSessionInput[],
  clientOptions: SessionClientOption[],
): { ok: true; sessions: ScheduledSession[] } | { ok: false; error: string } {
  if (inputs.length === 0) {
    return { ok: false, error: "No sessions to add." };
  }
  let current = sessions;
  for (const input of inputs) {
    const r = addSession(current, input, clientOptions);
    if (!r.ok) {
      return {
        ok: false,
        error: `${input.date} ${input.time}: ${r.error}`,
      };
    }
    current = r.sessions;
  }
  return { ok: true, sessions: current };
}

export function deleteSessionById(
  sessions: ScheduledSession[],
  sessionId: string,
): { ok: true; sessions: ScheduledSession[] } | { ok: false; error: string } {
  const target = sessions.find((s) => s.id === sessionId);
  if (!target) return { ok: false, error: "Session not found." };
  return {
    ok: true,
    sessions: sessions.filter((s) => s.id !== sessionId),
  };
}

export function filterSessionsForClient(
  sessions: ScheduledSession[],
  clientId?: string,
): ScheduledSession[] {
  if (!clientId) return [];
  return sessions.filter((s) => s.clientId === clientId);
}

export function filterSessionsForCoach(
  sessions: ScheduledSession[],
): ScheduledSession[] {
  return sessions;
}
