import { TrainingPlanSession, TrainingSessionExercise } from "@/types/training-plan";
import ExerciseTable from "./exercise-table";

type Props = {
  session: TrainingPlanSession;
  onUpdateSession: (updates: Partial<TrainingPlanSession>) => void;
  onDeleteSession: () => void;
  onAddExercise: () => void;
  onUpdateExercise: (
    exerciseId: string,
    updates: Partial<TrainingSessionExercise>
  ) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onReorderExercises: (activeId: string, overId: string) => void;
};

export default function SessionEditor({
  session,
  onUpdateSession,
  onDeleteSession,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onReorderExercises,
}: Props) {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[140px_minmax(0,1fr)]">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Day</label>
                  <input
                    type="number"
                    value={session.day_index ?? ""}
                    onChange={(e) =>
                      onUpdateSession({
                        day_index: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Session title</label>
                  <input
                    value={session.title}
                    onChange={(e) => onUpdateSession({ title: e.target.value })}
                    placeholder="Upper body"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Notes</label>
                <textarea
                  value={session.notes ?? ""}
                  onChange={(e) => onUpdateSession({ notes: e.target.value })}
                  rows={3}
                  placeholder="Session notes..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onAddExercise}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                + Add Exercise
              </button>

              <button
                type="button"
                onClick={onDeleteSession}
                className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Delete Session
              </button>
            </div>
          </div>
        </div>

        <ExerciseTable
          exercises={session.exercises}
          onUpdateExercise={onUpdateExercise}
          onDeleteExercise={onDeleteExercise}
          onReorderExercises={onReorderExercises}
        />
      </div>
    </div>
  );
}