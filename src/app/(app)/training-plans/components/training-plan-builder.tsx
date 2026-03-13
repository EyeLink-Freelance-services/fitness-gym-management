"use client";

import { useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import {
  TrainingPlan,
  TrainingPlanSession,
  TrainingSessionExercise,
} from "@/types/training-plan";
import TrainingPlanHeader from "./training-plan-header";
import SessionSidebar from "./session-sidebar";
import SessionEditor from "./session-editor";
import EmptyState from "./empty-state";

type Props = {
  initialPlan: TrainingPlan;
};

export default function TrainingPlanBuilder({ initialPlan }: Props) {
  const [plan, setPlan] = useState<TrainingPlan>(initialPlan);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialPlan.sessions[0]?.id ?? null
  );

  const selectedSession = useMemo(
    () => plan.sessions.find((s) => s.id === selectedSessionId) ?? null,
    [plan.sessions, selectedSessionId]
  );

  function updatePlanField<K extends keyof TrainingPlan>(
    key: K,
    value: TrainingPlan[K]
  ) {
    setPlan((prev) => ({
      ...prev,
      [key]: value,
      updated_at: new Date().toISOString(),
    }));
  }

  function addSession() {
    const newSession: TrainingPlanSession = {
      id: crypto.randomUUID(),
      plan_id: plan.id,
      day_index: plan.sessions.length + 1,
      title: `Day ${plan.sessions.length + 1}`,
      notes: "",
      order_index: plan.sessions.length,
      exercises: [],
    };

    setPlan((prev) => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
      updated_at: new Date().toISOString(),
    }));

    setSelectedSessionId(newSession.id);
  }

  function updateSession(sessionId: string, updates: Partial<TrainingPlanSession>) {
    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
      updated_at: new Date().toISOString(),
    }));
  }

  function removeSession(sessionId: string) {
    setPlan((prev) => {
      const nextSessions = prev.sessions
        .filter((s) => s.id !== sessionId)
        .map((s, index) => ({
          ...s,
          order_index: index,
          day_index: index + 1,
        }));

      return {
        ...prev,
        sessions: nextSessions,
        updated_at: new Date().toISOString(),
      };
    });

    setSelectedSessionId((current) => {
      if (current !== sessionId) return current;
      const next = plan.sessions.find((s) => s.id !== sessionId);
      return next?.id ?? null;
    });
  }

  function reorderSessions(activeId: string, overId: string) {
    setPlan((prev) => {
      const sorted = [...prev.sessions].sort((a, b) => a.order_index - b.order_index);
      const oldIndex = sorted.findIndex((s) => s.id === activeId);
      const newIndex = sorted.findIndex((s) => s.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }

      const moved = arrayMove(sorted, oldIndex, newIndex).map((session, index) => ({
        ...session,
        order_index: index,
        day_index: index + 1,
      }));

      return {
        ...prev,
        sessions: moved,
        updated_at: new Date().toISOString(),
      };
    });
  }

  function addExercise(sessionId: string) {
    const target = plan.sessions.find((s) => s.id === sessionId);
    const nextIndex = target?.exercises.length ?? 0;

    const newExercise: TrainingSessionExercise = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      name: "",
      sets: null,
      reps: null,
      weight: null,
      rest_seconds: null,
      tempo: "",
      order_index: nextIndex,
    };

    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, exercises: [...session.exercises, newExercise] }
          : session
      ),
      updated_at: new Date().toISOString(),
    }));
  }

  function updateExercise(
    sessionId: string,
    exerciseId: string,
    updates: Partial<TrainingSessionExercise>
  ) {
    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
              ),
            }
          : session
      ),
      updated_at: new Date().toISOString(),
    }));
  }

  function removeExercise(sessionId: string, exerciseId: string) {
    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises
                .filter((exercise) => exercise.id !== exerciseId)
                .map((exercise, index) => ({
                  ...exercise,
                  order_index: index,
                })),
            }
          : session
      ),
      updated_at: new Date().toISOString(),
    }));
  }

  function reorderExercises(sessionId: string, activeId: string, overId: string) {
    setPlan((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) => {
        if (session.id !== sessionId) return session;

        const sorted = [...session.exercises].sort(
          (a, b) => a.order_index - b.order_index
        );

        const oldIndex = sorted.findIndex((e) => e.id === activeId);
        const newIndex = sorted.findIndex((e) => e.id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return session;
        }

        return {
          ...session,
          exercises: arrayMove(sorted, oldIndex, newIndex).map((exercise, index) => ({
            ...exercise,
            order_index: index,
          })),
        };
      }),
      updated_at: new Date().toISOString(),
    }));
  }

  async function handleSave() {
    console.log("Saving plan", plan);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TrainingPlanHeader
        title={plan.title}
        description={plan.description}
        status={plan.status}
        onChangeTitle={(value) => updatePlanField("title", value)}
        onChangeDescription={(value) => updatePlanField("description", value)}
        onChangeStatus={(value) => updatePlanField("status", value)}
        onSave={handleSave}
      />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SessionSidebar
          sessions={plan.sessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
          onAddSession={addSession}
          onReorderSessions={reorderSessions}
        />

        <div className="min-w-0 border-t border-slate-200 bg-white lg:border-l lg:border-t-0">
          {selectedSession ? (
            <SessionEditor
              session={selectedSession}
              onUpdateSession={(updates) => updateSession(selectedSession.id, updates)}
              onDeleteSession={() => removeSession(selectedSession.id)}
              onAddExercise={() => addExercise(selectedSession.id)}
              onUpdateExercise={(exerciseId, updates) =>
                updateExercise(selectedSession.id, exerciseId, updates)
              }
              onDeleteExercise={(exerciseId) =>
                removeExercise(selectedSession.id, exerciseId)
              }
              onReorderExercises={(activeId, overId) =>
                reorderExercises(selectedSession.id, activeId, overId)
              }
            />
          ) : (
            <EmptyState
              title="No session selected"
              description="Create a session to start building this training plan."
            />
          )}
        </div>
      </div>
    </div>
  );
}