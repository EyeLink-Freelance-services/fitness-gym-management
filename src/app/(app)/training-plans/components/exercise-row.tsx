"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ExerciseField } from "./session-editor";
import { useFormContext } from "react-hook-form";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";
import { toast } from "sonner";
import { preventNegativeKeyDown } from "@/lib/validation/helpers/check-number";
import { useEffect, useRef } from "react";

type Props = {
  exercise: ExerciseField;
  sessionIndex: number;
  exerciseIndex: number;
  mode: "mobile" | "desktop";
  onDelete: () => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium text-dark-5 dark:text-dark-6">
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-stroke bg-white px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white dark:focus:border-primary ${className}`}
    />
  );
}

export default function ExerciseRow({
  exercise,
  sessionIndex,
  exerciseIndex,
  mode,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exercise.fieldId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { register, formState: {errors} } = useFormContext<TrainingPlanFormInput>();

  const basePath = `sessions.${sessionIndex}.exercises.${exerciseIndex}` as const;

  const exerciseNameError = errors.sessions?.[sessionIndex]?.exercises?.[exerciseIndex]?.name?.message;

  useEffect(() => {
    if (exerciseNameError) {
      toast.error(exerciseNameError, {
        id: `exercise-name-${exerciseIndex}`,
      });
    }
  }, [exerciseNameError, exerciseIndex]);

  if (mode === "mobile") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-white p-4 dark:bg-dark-2 ${isDragging ? "opacity-60" : ""}`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark dark:text-white">
              {exercise.name || "New exercise"}
            </p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
              Reorder and edit exercise details
            </p>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-dark-5 transition hover:bg-gray-1 hover:text-dark active:cursor-grabbing dark:text-dark-6 dark:hover:bg-white/5 dark:hover:text-white"
            {...attributes}
            {...listeners}
            aria-label={`Reorder ${exercise.name || "exercise"}`}
          >
            ⋮⋮
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel>Exercise</FieldLabel>
            <Input
              {...register(`${basePath}.name`)}
              placeholder="Exercise name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Sets</FieldLabel>
              <Input
                type="number"
                {...register(`${basePath}.sets`)}
                onKeyDown={(e) => preventNegativeKeyDown(e, "sets")}
              />
            </div>

            <div>
              <FieldLabel>Reps</FieldLabel>
              <Input
                type="number"
                {...register(`${basePath}.reps`)}
                onKeyDown={(e) => preventNegativeKeyDown(e, "reps")}
              />
            </div>

            <div>
              <FieldLabel>Weight</FieldLabel>
              <Input
                type="number"
                step="0.01"
                {...register(`${basePath}.weight`)}
                placeholder="kg"
                onKeyDown={(e) => preventNegativeKeyDown(e, "weight")}
              />
            </div>

            <div>
              <FieldLabel>Rest (sec)</FieldLabel>
              <Input
                type="number"
                {...register(`${basePath}.rest_seconds`)}
                onKeyDown={(e) => preventNegativeKeyDown(e, "rest_seconds")}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Tempo</FieldLabel>
            <Input
              type='text'
              {...register(`${basePath}.tempo`)}
              placeholder="e.g. 3-1-1"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-dark dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-60" : ""}`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          className="cursor-grab rounded-md px-2 py-2 text-dark-5 transition hover:bg-gray-1 hover:text-dark active:cursor-grabbing dark:text-dark-6 dark:hover:bg-white/5 dark:hover:text-white"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${exercise.name || "exercise"}`}
        >
          ⋮⋮
        </button>
      </td>

      <td className="px-4 py-3">
        <Input
          {...register(`${basePath}.name`)}
          placeholder="Exercise name"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          {...register(`${basePath}.sets`)}
          className="w-20"
          onKeyDown={(e) => preventNegativeKeyDown(e, "sets")}
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          {...register(`${basePath}.reps`)}
          className="w-20"
          onKeyDown={(e) => preventNegativeKeyDown(e, "reps")}
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          step="0.01"
          {...register(`${basePath}.weight`)}
          placeholder="kg"
          className="w-24"
          onKeyDown={(e) => preventNegativeKeyDown(e, "weight")}
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          {...register(`${basePath}.rest_seconds`)}
          placeholder="in seconds"
          className="w-24"
          onKeyDown={(e) => preventNegativeKeyDown(e, "rest_seconds")}
        />
      </td>

      <td className="px-4 py-3">
        <Input
          {...register(`${basePath}.tempo`)}
          placeholder="e.g. 3-1-1"
          className="w-24"
        />
      </td>

      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-dark dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}