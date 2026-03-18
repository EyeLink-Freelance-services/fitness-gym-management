"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SessionListItem from "./session-list-item";
import { TrainingPlanSessionFormInput } from "@/lib/validation/schemas/training-plan-sessions";
import { useFormContext } from "react-hook-form";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";

export type SessionField = TrainingPlanSessionFormInput & {
  fieldId: string;
};

type Props = {
  sessions: SessionField[];
  selectedSessionKey: string | null;
  onSelectSessionKey: (fieldId: string) => void;
  onAddSession: () => void;
  onReorderSessions: (activeFieldId: string, overFieldId: string) => void;
};

export default function SessionSidebar({
  sessions,
  selectedSessionKey,
  onSelectSessionKey,
  onAddSession,
  onReorderSessions,
}: Props) {

  const {formState: {errors}} = useFormContext<TrainingPlanFormInput>();

  const sortedSessions = [...sessions].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onReorderSessions(String(active.id), String(over.id));
  }

  return (
    <aside className="h-full border-r border-stroke bg-gray-1 dark:border-dark-3 dark:bg-dark">
      <div className="flex h-full flex-col p-4 md:p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-dark dark:text-white">
              Sessions
            </h2>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Organize workout days
            </p>
          </div>

          <button
            type="button"
            onClick={onAddSession}
            className="inline-flex items-center justify-center rounded-lg border border-stroke bg-white px-3 py-2 text-xs font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-white/5"
          >
            + Add
          </button>
        </div>

        {errors.sessions && (
          <p className="text-body-xs text-red-500 dark:text-red-400">
            {errors.sessions.message}
          </p>
        )}

        {sortedSessions.length === 0 ? (
          
          <div className="rounded-2xl border border-dashed border-stroke bg-white p-5 text-sm text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
            No sessions yet.
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedSessions.map((session) => session.fieldId)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {sortedSessions.map((session) => (
                    <SessionListItem
                      key={session.fieldId}
                      session={session}
                      isActive={session.fieldId === selectedSessionKey}
                      onClick={() => onSelectSessionKey(session.fieldId)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </aside>
  );
}