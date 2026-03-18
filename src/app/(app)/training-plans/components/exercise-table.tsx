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
import ExerciseRow from "./exercise-row";
import { ExerciseField } from "./session-editor";
import { useFormContext } from "react-hook-form";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";

type Props = {
  sessionIndex: number;
  exercises: ExerciseField[];
  onDeleteExercise: (exerciseIndex: number) => void;
  onReorderExercises: (activeId: string, overId: string) => void;
};

export default function ExerciseTable({
  sessionIndex,
  exercises,
  onDeleteExercise,
  onReorderExercises,
}: Props) {

  const { formState: {errors} } = useFormContext<TrainingPlanFormInput>();

  const sortedExercises = [...exercises].sort(
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

    onReorderExercises(String(active.id), String(over.id));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
      {errors.sessions && errors.sessions[sessionIndex]?.exercises && (
        <p className="pl-2 text-body-xs text-red-500 dark:text-red-400">
          {errors.sessions[sessionIndex]?.exercises.message}
        </p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedExercises.map((exercise) => exercise.fieldId)}
          strategy={verticalListSortingStrategy}
        >
          {sortedExercises.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <p className="text-sm font-medium text-dark dark:text-white">
                  No exercises yet
                </p>
                <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
                  Add one to start building this session.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="divide-y divide-stroke dark:divide-dark-3 md:hidden">
                {sortedExercises.map((exercise, exerciseIndex) => (
                  <ExerciseRow
                    key={exercise.fieldId}
                    exercise={exercise}
                    exerciseIndex={exerciseIndex}
                    sessionIndex={sessionIndex}
                    mode="mobile"
                    onDelete={() => onDeleteExercise(exerciseIndex)}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-1 dark:bg-dark">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">
                      <th className="w-14 px-4 py-3"></th>
                      <th className="px-4 py-3">Exercise</th>
                      <th className="px-4 py-3">Sets</th>
                      <th className="px-4 py-3">Reps</th>
                      <th className="px-4 py-3">Weight</th>
                      <th className="px-4 py-3">Rest</th>
                      <th className="px-4 py-3">Tempo</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stroke dark:divide-dark-3">
                    {sortedExercises.map((exercise, exerciseIndex) => (
                      <ExerciseRow
                        key={exercise.fieldId}
                        exercise={exercise}
                        exerciseIndex={exerciseIndex}
                        sessionIndex={sessionIndex}
                        mode="desktop"
                        onDelete={() => onDeleteExercise(exerciseIndex)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}