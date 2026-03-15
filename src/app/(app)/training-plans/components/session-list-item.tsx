"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { TrainingPlanSession } from "@/types/training-plan";

type Props = {
  session: TrainingPlanSession;
  isActive: boolean;
  onClick: () => void;
};

export default function SessionListItem({
  session,
  isActive,
  onClick,
}: Props) {
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

  const dayLabel = session.day_index ?? session.order_index + 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={[
        "group w-full cursor-pointer rounded-2xl border px-4 py-3 transition-all duration-200",
        isActive
          ? "border-primary bg-white shadow-sm dark:bg-dark-2"
          : "border-stroke bg-white hover:border-primary/40 hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary/40 dark:hover:bg-white/5",
        isDragging ? "opacity-60 shadow-lg" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-0.5 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-dark-5 transition hover:bg-gray-2 hover:text-dark active:cursor-grabbing dark:text-dark-6 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={(e) => e.stopPropagation()}
          aria-label="Reorder session"
        >
          <span className="text-sm leading-none">⋮⋮</span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">
            Day {dayLabel}
          </p>

          <p
            className={[
              "truncate text-sm font-semibold transition-colors",
              isActive
                ? "text-primary dark:text-primary"
                : "text-dark dark:text-white",
            ].join(" ")}
          >
            {session.title || "Untitled session"}
          </p>

          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            {session.exercises.length}{" "}
            {session.exercises.length === 1 ? "exercise" : "exercises"}
          </p>
        </div>
      </div>
    </div>
  );
}