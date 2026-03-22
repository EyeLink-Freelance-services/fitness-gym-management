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
import SectionHeader from "@/components/ui/section-header";

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
    <aside className={`${sortedSessions.length === 0 && "lg:rounded-r-3xl"} h-full  bg-gradient-to-b from-white via-gray-1 to-gray-1 dark:from-dark dark:via-dark dark:to-dark-2`}>
      <div className="flex h-full flex-col p-4 md:p-5">
        <div className="relative mb-5 overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
            <SectionHeader
              badge="Training Session"
              title="Sessions"
              description="Organize workout days and reorder sessions."
            />
            <div className="p-5">
              <button
                type="button"
                onClick={onAddSession}
                className="mt-4 w-full inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
              >
                {sortedSessions.length === 0 ? "Create first session" : "+ Add Session"}
              </button>
            </div>
        </div>

        {errors.sessions?.message && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {errors.sessions.message}
          </div>
        )}

        {sortedSessions.length === 0 ? (
          <div className="flex flex-1 items-center">
            <div className="w-full rounded-3xl border border-dashed border-stroke bg-white/80 p-6 text-center shadow-sm dark:border-dark-3 dark:bg-dark-2/80">

              <h3 className="text-base font-semibold text-dark dark:text-white">
                No sessions yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
                Build days like
                Upper Body, Push, Pull, Legs, or Recovery.
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-stroke/70 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                Session List
              </p>

              <span className="rounded-full bg-gray-1 px-2.5 py-1 text-xs font-medium text-dark-5 dark:bg-dark dark:text-dark-6">
                Drag to reorder
              </span>
            </div>

            <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedSessions.map((session) => session.fieldId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {sortedSessions.map((session) => (
                      <div
                        key={session.fieldId}
                        className="group rounded-2xl border border-transparent transition hover:border-stroke/70 hover:bg-gray-1/70 dark:hover:border-dark-3 dark:hover:bg-dark"
                      >
                        <SessionListItem
                          session={session}
                          isActive={session.fieldId === selectedSessionKey}
                          onClick={() => onSelectSessionKey(session.fieldId)}
                        />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}