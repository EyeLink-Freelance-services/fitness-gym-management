"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TrainingSessionExercise } from "@/types/training-plan";

type Props = {
  exercise: TrainingSessionExercise;
  onUpdate: (updates: Partial<TrainingSessionExercise>) => void;
  onDelete: () => void;
};

function numberValue(value: string) {
  return value === "" ? null : Number(value);
}

export default function ExerciseRow({ exercise, onUpdate, onDelete }: Props) {
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

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-slate-200 align-top ${isDragging ? "opacity-60" : ""}`}
    >
      <td className="px-4 py-3">
        <button
          type="button"
          className="cursor-grab rounded-md px-2 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${exercise.name || "exercise"}`}
        >
          ⋮⋮
        </button>
      </td>

      <td className="px-4 py-3">
        <input
          value={exercise.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Exercise name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          value={exercise.sets ?? ""}
          onChange={(e) => onUpdate({ sets: numberValue(e.target.value) })}
          className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          value={exercise.reps ?? ""}
          onChange={(e) => onUpdate({ reps: numberValue(e.target.value) })}
          className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          step="0.01"
          value={exercise.weight ?? ""}
          onChange={(e) => onUpdate({ weight: numberValue(e.target.value) })}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          value={exercise.rest_seconds ?? ""}
          onChange={(e) => onUpdate({ rest_seconds: numberValue(e.target.value) })}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3">
        <input
          value={exercise.tempo ?? ""}
          onChange={(e) => onUpdate({ tempo: e.target.value })}
          className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </td>

      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}