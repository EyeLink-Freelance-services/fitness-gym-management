import ExerciseTable from "./exercise-table";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Button } from "@/components/ui-elements/button";
import { SessionField } from "./session-sidebar";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";
import { arrayMove } from "@dnd-kit/sortable";
import { TrainingPlanExerciseFormInput } from "@/lib/validation/schemas/training_session_exercises";
import SectionHeader from "@/components/ui/section-header";

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
    <div className="h-full overflow-auto bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-dark dark:via-dark dark:to-dark-2">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-5 md:px-6 lg:px-8">
        
        {/* Session details card */}
        <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
          <SectionHeader
            badge="Session Editor"
            title="Session Details"
            description="Update the workout day, title, and notes for this session."
          />
          <div className="relative border-b border-stroke/70 px-5 py-2 dark:border-dark-3" />

          <div className="relative flex flex-col gap-6 p-5 md:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              
              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                  <div className="rounded-2xl border border-stroke/70 bg-white/70 p-4 dark:border-dark-3 dark:bg-dark">
                    <InputGroup
                      label="Day"
                      labelClassName="text-sm font-medium"
                      type="number"
                      placeholder="1"
                      error={errors.sessions && errors.sessions[sessionIndex]?.day_index?.message}
                      inputProps={{
                        ...register(`sessions.${sessionIndex}.day_index`),
                        min: 1,
                      }}
                    />
                  </div>

                  <div className="rounded-2xl border border-stroke/70 bg-white/70 p-4 dark:border-dark-3 dark:bg-dark">
                    <InputGroup
                      label="Session title"
                      labelClassName="text-sm font-medium"
                      type="text"
                      placeholder="Upper body"
                      error={errors.sessions && errors.sessions[sessionIndex]?.title?.message}
                      inputProps={{
                        ...register(`sessions.${sessionIndex}.title`),
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-stroke/70 bg-white/70 p-4 dark:border-dark-3 dark:bg-dark">
                  <TextAreaGroup
                    label="Notes"
                    labelClassName="text-sm font-medium"
                    placeholder="Session notes..."
                    error={errors.sessions && errors.sessions[sessionIndex]?.notes?.message}
                    textareaProps={{
                      ...register(`sessions.${sessionIndex}.notes`),
                      rows: 4,
                      className: "resize-none",
                    }}
                  />
                </div>
              </div>

              <div className="w-full xl:w-[240px]">
                <div className="rounded-3xl border border-stroke/70 bg-gradient-to-b from-gray-1 to-white p-4 shadow-sm dark:border-dark-3 dark:from-dark dark:to-dark-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                    Actions
                  </p>
                  <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
                    Add exercises to this session or remove it from the plan.
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={onAddExercise}
                      className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
                      label="+ Add Exercise"
                    />

                    <Button
                      type="button"
                      onClick={onDeleteSession}
                      className="w-full rounded-2xl border border-rose-300 bg-white px-4 py-3 text-sm font-semibold !text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-dark dark:!text-rose-400 dark:hover:bg-rose-500/10"
                      label="Delete Session"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises card */}
        <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
          <SectionHeader
            badge="Exercise Builder"
            title="Exercises"
            description="Manage and reorder the exercises inside this session."
          />
          <div className="relative border-b border-stroke/70 px-5 py-2 dark:border-dark-3" />

          <div className="relative p-5 md:p-6">
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