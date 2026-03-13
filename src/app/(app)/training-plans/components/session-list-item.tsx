"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TrainingPlanSession } from "@/types/training-plan";

type Props = {
  session: TrainingPlanSession;
  isActive: boolean;
  onClick: () => void;
};

export default function SessionListItem({ session, isActive, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: session.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={[
        "w-full rounded-xl border px-4 py-3 cursor-pointer transition",
        isActive
          ? "border-slate-900 bg-white shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100",
        isDragging ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">

        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-400 hover:text-slate-700 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          ⋮⋮
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase text-slate-500">
            Day {session.day_index ?? session.order_index + 1}
          </p>

          <p className="truncate text-sm font-semibold text-slate-900">
            {session.title}
          </p>

          <p className="text-xs text-slate-500">
            {session.exercises.length} exercises
          </p>
        </div>
      </div>
    </div>
  );
}