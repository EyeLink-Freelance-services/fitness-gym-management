"use client";

import {
  createTrainingSessionAction,
  deleteTrainingSessionAction,
  fetchTrainingSessionsAction,
} from "@/app/(app)/dashboard/company/sessions/actions";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import type {
  ScheduledSession,
  SessionSchedulingRole,
} from "@/types/session-scheduling";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function filterSessionsForClient(
  sessions: ScheduledSession[],
  clientId?: string,
): ScheduledSession[] {
  if (!clientId) return [];
  return sessions.filter((session) => session.clientId === clientId);
}

export function useSessionScheduling(
  role: SessionSchedulingRole,
  initialSessions: ScheduledSession[],
  viewerClientId?: string,
) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ScheduledSession[]>(initialSessions);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  const visibleSessions = useMemo(() => {
    if (role === "coach") return sessions;
    return filterSessionsForClient(sessions, viewerClientId);
  }, [role, sessions, viewerClientId]);

  const createSessionsBatch = useCallback(
    async (inputs: BookSessionInput[]) => {
      if (inputs.length === 0) {
        return { ok: false as const, error: "No sessions to add." };
      }

      for (const input of inputs) {
        const result = await createTrainingSessionAction(input);
        if (!result.ok) {
          return {
            ok: false as const,
            error: `${input.date} ${input.timeFrom}: ${result.error}`,
          };
        }
      }

      const refreshed = await fetchTrainingSessionsAction();
      setSessions(refreshed);
      router.refresh();
      return { ok: true as const };
    },
    [router],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      const target = sessions.find((session) => session.id === sessionId);
      if (!target) {
        return { ok: false as const, error: "Session not found." };
      }

      const result = await deleteTrainingSessionAction(target);
      if (!result.ok) return result;

      const refreshed = await fetchTrainingSessionsAction();
      setSessions(refreshed);
      router.refresh();
      return { ok: true as const };
    },
    [router, sessions],
  );

  return {
    sessions,
    visibleSessions,
    createSessionsBatch,
    deleteSession,
  };
}
