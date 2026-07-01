"use server";

import { buildTrainingSessionRequest } from "@/modules/company/training-session.mappers";
import {
  createTrainingSession,
  deleteTrainingSession,
  getTrainingSessions,
} from "@/services/company/training-session.service";
import { validateNewSession } from "@/services/session-scheduling/validation";
import type { BookSessionInput } from "@/services/session-scheduling/validation";
import type { ScheduledSession } from "@/types/session-scheduling";
import { revalidatePath } from "next/cache";

function revalidateSessionPaths() {
  revalidatePath("/dashboard/company/sessions");
  revalidatePath("/dashboard/company");
}

export async function fetchTrainingSessionsAction() {
  return getTrainingSessions();
}

export async function createTrainingSessionAction(input: BookSessionInput) {
  const existingSessions = await getTrainingSessions();
  const error = validateNewSession(input, existingSessions);
  if (error) {
    return { ok: false as const, error };
  }

  try {
    await createTrainingSession(
      input.clientId,
      buildTrainingSessionRequest(
        input.title,
        input.date,
        input.timeFrom,
        input.timeTo,
      ),
    );
    revalidateSessionPaths();
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create session.";
    return { ok: false as const, error: message };
  }
}

export async function deleteTrainingSessionAction(session: ScheduledSession) {
  try {
    await deleteTrainingSession(session.clientId, session.id);
    revalidateSessionPaths();
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete session.";
    return { ok: false as const, error: message };
  }
}
