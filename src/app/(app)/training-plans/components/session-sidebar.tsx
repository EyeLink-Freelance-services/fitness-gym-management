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
import { TrainingPlanSession } from "@/types/training-plan";
import SessionListItem from "./session-list-item";

type Props = {
  sessions: TrainingPlanSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onAddSession: () => void;
  onReorderSessions: (activeId: string, overId: string) => void;
};

export default function SessionSidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  onAddSession,
  onReorderSessions,
}: Props) {
  const sortedSessions = [...sessions].sort((a, b) => a.order_index - b.order_index);

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
    <aside className="bg-slate-50">
      <div className="h-full p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Sessions</h2>
            <p className="text-xs text-slate-500">Organize workout days</p>
          </div>
          <button
            type="button"
            onClick={onAddSession}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            + Add
          </button>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No sessions yet.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSessions.map((session) => session.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedSessions.map((session) => (
                  <SessionListItem
                    key={session.id}
                    session={session}
                    isActive={session.id === selectedSessionId}
                    onClick={() => onSelectSession(session.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  );
}