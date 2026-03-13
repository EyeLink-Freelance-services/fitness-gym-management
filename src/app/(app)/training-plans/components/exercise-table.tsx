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
import { TrainingSessionExercise } from "@/types/training-plan";
import ExerciseRow from "./exercise-row";

type Props = {
  exercises: TrainingSessionExercise[];
  onUpdateExercise: (
    exerciseId: string,
    updates: Partial<TrainingSessionExercise>
  ) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onReorderExercises: (activeId: string, overId: string) => void;
};

export default function ExerciseTable({
  exercises,
  onUpdateExercise,
  onDeleteExercise,
  onReorderExercises,
}: Props) {
  const sortedExercises = [...exercises].sort((a, b) => a.order_index - b.order_index);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    onReorderExercises(String(active.id), String(over.id));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Exercises</h3>
        <p className="text-xs text-slate-500">Drag rows to reorder exercises</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 w-14"></th>
              <th className="px-4 py-3">Exercise</th>
              <th className="px-4 py-3">Sets</th>
              <th className="px-4 py-3">Reps</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Rest</th>
              <th className="px-4 py-3">Tempo</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedExercises.map((exercise) => exercise.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {sortedExercises.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                      No exercises yet. Add one to start building this session.
                    </td>
                  </tr>
                ) : (
                  sortedExercises.map((exercise) => (
                    <ExerciseRow
                      key={exercise.id}
                      exercise={exercise}
                      onUpdate={(updates) => onUpdateExercise(exercise.id, updates)}
                      onDelete={() => onDeleteExercise(exercise.id)}
                    />
                  ))
                )}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
      </div>
    </div>
  );
}