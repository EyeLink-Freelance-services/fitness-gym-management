import ExerciseTable from "./exercise-table";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Button } from "@/components/ui-elements/button";
import { SessionField } from "./session-sidebar";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";
import { arrayMove } from "@dnd-kit/sortable";
import { TrainingPlanExerciseFormInput } from "@/lib/validation/schemas/training_session_exercises";

export type ExerciseField = TrainingPlanExerciseFormInput & {
  fieldId: string;
};

type Props = {
  session: SessionField;
  sessionIndex: number;
  onDeleteSession: () => void;
};

export default function SessionEditor({
  session,
  sessionIndex,
  onDeleteSession,
}: Props) {
  const { control, register, watch, formState: {errors} } =
    useFormContext<TrainingPlanFormInput>();

  const {
    fields: exercises,
    append,
    replace,
  } = useFieldArray({
    control,
    name: `sessions.${sessionIndex}.exercises`,
    keyName: "fieldId",
  });

  const watchedExercises =
    watch(`sessions.${sessionIndex}.exercises`) ?? [];

  const exercisesWithValues: ExerciseField[] = exercises.map((field, index) => ({
    ...field,
    ...watchedExercises[index],
  }));

  function onAddExercise() {
    append({
      id: undefined,
      session_id: session.id ?? undefined,
      name: "",
      sets: undefined,
      reps: undefined,
      weight: undefined,
      rest_seconds: undefined,
      tempo: "",
      order_index: exercises.length,
    });
  }

  function removeExercise(exerciseIndex: number) {
    const nextExercises = (watch(`sessions.${sessionIndex}.exercises`) ?? [])
      .filter((_, index) => index !== exerciseIndex)
      .map((exercise, index) => ({
        ...exercise,
        order_index: index,
      }));

    replace(nextExercises);
  }

  function reorderExercises(activeFieldId: string, overFieldId: string) {
    const oldIndex = exercises.findIndex((e) => e.fieldId === activeFieldId);
    const newIndex = exercises.findIndex((e) => e.fieldId === overFieldId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = arrayMove(
      watch(`sessions.${sessionIndex}.exercises`) ?? [],
      oldIndex,
      newIndex
    ).map((exercise, index) => ({
      ...exercise,
      order_index: index,
    }));

    replace(reordered);
  }

  return (
    <div className="h-full overflow-auto bg-gray-1 dark:bg-dark">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-5 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <div className="border-b border-stroke px-5 py-4 dark:border-dark-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-dark dark:text-white">
                Session Details
              </h2>
              <p className="text-sm text-dark-5 dark:text-dark-6">
                Update the workout day, title, and notes for this session.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                  <InputGroup
                    label="Day"
                    labelClassName="text-sm"
                    type="number"
                    placeholder="1"
                    error={errors.sessions && errors.sessions[sessionIndex]?.day_index?.message}
                    inputProps={{
                      ...register(`sessions.${sessionIndex}.day_index`),
                      min: 1,
                    }}
                  />

                  <InputGroup
                    label="Session title"
                    labelClassName="text-sm"
                    type="text"
                    placeholder="Upper body"
                    error={errors.sessions && errors.sessions[sessionIndex]?.title?.message}
                    inputProps={{
                      ...register(`sessions.${sessionIndex}.title`),
                    }}
                  />
                </div>

                <TextAreaGroup
                  label="Notes"
                  labelClassName="text-sm"
                  placeholder="Session notes..."
                  error={errors.sessions && errors.sessions[sessionIndex]?.notes?.message}
                  textareaProps={{
                    ...register(`sessions.${sessionIndex}.notes`),
                    rows: 4,
                    className: "resize-none",
                  }}
                />
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-[220px] xl:flex-col">
                <Button
                  type="button"
                  onClick={onAddExercise}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  label="+ Add Exercise"
                />

                <Button
                  type="button"
                  onClick={onDeleteSession}
                  className="w-full rounded-lg border border-rose-300 bg-white px-4 py-3 text-sm font-medium !text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-dark dark:!text-rose-400 dark:hover:bg-rose-500/10"
                  label="Delete Session"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <div className="border-b border-stroke px-5 py-4 dark:border-dark-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Exercises
              </h3>
              <p className="text-sm text-dark-5 dark:text-dark-6">
                Manage and reorder the exercises inside this session.
              </p>
            </div>
          </div>

          <div className="p-5">
            <ExerciseTable
              sessionIndex={sessionIndex}
              exercises={exercisesWithValues}
              onDeleteExercise={removeExercise}
              onReorderExercises={reorderExercises}
            />
          </div>
        </div>
      </div>
    </div>
  );
}