"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TrainingSessionExercise } from "@/types/training-plan";

type Props = {
  exercise: TrainingSessionExercise;
  mode: "mobile" | "desktop";
  onUpdate: (updates: Partial<TrainingSessionExercise>) => void;
  onDelete: () => void;
};

function numberValue(value: string) {
  return value === "" ? null : Number(value);
}

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
  mode,
  onUpdate,
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
    id: exercise.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
              value={exercise.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Exercise name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Sets</FieldLabel>
              <Input
                type="number"
                value={exercise.sets ?? ""}
                onChange={(e) =>
                  onUpdate({ sets: numberValue(e.target.value) })
                }
              />
            </div>

            <div>
              <FieldLabel>Reps</FieldLabel>
              <Input
                type="number"
                value={exercise.reps ?? ""}
                onChange={(e) =>
                  onUpdate({ reps: numberValue(e.target.value) })
                }
              />
            </div>

            <div>
              <FieldLabel>Weight</FieldLabel>
              <Input
                type="number"
                step="0.01"
                value={exercise.weight ?? ""}
                onChange={(e) =>
                  onUpdate({ weight: numberValue(e.target.value) })
                }
              />
            </div>

            <div>
              <FieldLabel>Rest (sec)</FieldLabel>
              <Input
                type="number"
                value={exercise.rest_seconds ?? ""}
                onChange={(e) =>
                  onUpdate({ rest_seconds: numberValue(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <FieldLabel>Tempo</FieldLabel>
            <Input
              value={exercise.tempo ?? ""}
              onChange={(e) => onUpdate({ tempo: e.target.value })}
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
          value={exercise.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Exercise name"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          value={exercise.sets ?? ""}
          onChange={(e) => onUpdate({ sets: numberValue(e.target.value) })}
          className="w-20"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          value={exercise.reps ?? ""}
          onChange={(e) => onUpdate({ reps: numberValue(e.target.value) })}
          className="w-20"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          step="0.01"
          value={exercise.weight ?? ""}
          onChange={(e) => onUpdate({ weight: numberValue(e.target.value) })}
          className="w-24"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          type="number"
          value={exercise.rest_seconds ?? ""}
          onChange={(e) =>
            onUpdate({ rest_seconds: numberValue(e.target.value) })
          }
          className="w-24"
        />
      </td>

      <td className="px-4 py-3">
        <Input
          value={exercise.tempo ?? ""}
          onChange={(e) => onUpdate({ tempo: e.target.value })}
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