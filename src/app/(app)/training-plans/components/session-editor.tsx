import { TrainingPlanSession, TrainingSessionExercise } from "@/types/training-plan";
import ExerciseTable from "./exercise-table";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Button } from "@/components/ui-elements/button";

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
        <div className="flex flex-col gap-4 rounded-2xl border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                <InputGroup
                  label="Day"
                  type="number"
                  placeholder="1"
                  value={session.day_index?.toString() ?? ""}
                  handleChange={(e) =>
                    onUpdateSession({
                      day_index: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  inputProps={{
                    min: 1,
                  }}
                />

                <InputGroup
                  label="Session title"
                  type="text"
                  placeholder="Upper body"
                  value={session.title}
                  handleChange={(e) =>
                    onUpdateSession({ title: e.target.value })
                  }
                />
              </div>

              <TextAreaGroup
                label="Notes"
                placeholder="Session notes..."
                textareaProps={{
                  rows: 3,
                  value: session.notes ?? "",
                  onChange: (e) =>
                    onUpdateSession({ notes: e.target.value }),
                  className: "resize-none",
                }}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <Button
                type="button"
                onClick={onAddExercise}
                className="rounded-lg bg-primary text-sm font-medium text-white transition hover:opacity-90"
                label="+ Add Exercise"
              />

              <Button
                type="button"
                onClick={onDeleteSession}
                className="rounded-lg border border-rose-300 bg-white px-4 py-3 text-sm font-medium !text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-dark dark:text-rose-400 dark:hover:bg-rose-500/10"
                label="Delete Session"
              />
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