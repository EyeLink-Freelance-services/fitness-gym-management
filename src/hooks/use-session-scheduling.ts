"use client";

import {
  addSessionsBatch,
  deleteSessionById,
  filterSessionsForClient,
  filterSessionsForCoach,
  isClientAssignedToCoach,
} from "@/services/session-scheduling/session-store";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import type {
  ScheduledSession,
  SessionClientOption,
  SessionSchedulingRole,
} from "@/types/session-scheduling";
import { useCallback, useMemo, useState } from "react";

export function useSessionScheduling(
  role: SessionSchedulingRole,
  initialSessions: ScheduledSession[],
  clientOptions: SessionClientOption[],
  viewerClientId?: string,
) {
  const [sessions, setSessions] = useState<ScheduledSession[]>(initialSessions);

  const visibleSessions = useMemo(() => {
    if (role === "coach") return filterSessionsForCoach(sessions);
    return filterSessionsForClient(sessions, viewerClientId);
  }, [role, sessions, viewerClientId]);

  const createSessionsBatch = useCallback(
    (inputs: BookSessionInput[]) => {
      const result = addSessionsBatch(sessions, inputs, clientOptions);
      if (!result.ok) return result;
      setSessions(result.sessions);
      return result;
    },
    [clientOptions, sessions],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      const result = deleteSessionById(sessions, sessionId);
      if (!result.ok) return result;
      setSessions(result.sessions);
      return result;
    },
    [sessions],
  );

  return {
    sessions,
    visibleSessions,
    isClientAssigned:
      !!viewerClientId && isClientAssignedToCoach(viewerClientId, clientOptions),
    createSessionsBatch,
    deleteSession,
  };
}
