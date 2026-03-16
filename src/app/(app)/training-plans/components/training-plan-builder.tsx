"use client";

import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import TrainingPlanHeader from "./training-plan-header";
import SessionSidebar from "./session-sidebar";
import SessionEditor from "./session-editor";
import EmptyState from "./empty-state";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { TrainingPlanFormInput, TrainingPlanFormSchema } from "@/lib/validation/schemas/training-plans";
import { useCompany } from "@/app/context/company-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTrainingPlanAction, saveTrainingPlanAction } from "../actions";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { toast } from "sonner";

type Props = {
  initialPlan?: TrainingPlanFormInput;
};

export default function TrainingPlanBuilder({ initialPlan }: Props) {
  const company = useCompany();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const methods = useForm<TrainingPlanFormInput>({
    mode: "onChange",
    resolver: zodResolver(TrainingPlanFormSchema),
    defaultValues: {
      id: initialPlan?.id,
      company_id: company.id,
      title: initialPlan?.title ?? "",
			description: initialPlan?.description ?? "",
			level: initialPlan?.level ?? 1,
			status: initialPlan?.status ?? "draft",
			sessions: initialPlan?.sessions ?? [],
			created_by: initialPlan?.created_by ?? undefined,
			updated_by: initialPlan?.updated_by ?? null,
		},
  })

  const { control, handleSubmit, watch, setValue, getValues } = methods;

  const {
    fields: sessions,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "sessions",
    keyName: "fieldId"
  });

  const watchedSessions = watch("sessions");

  const sessionsWithValues = sessions.map((field, index) => ({
    ...field,
    ...watchedSessions?.[index],
  }));

  const [selectedSessionKey, setSelectedSessionKey] = useState<string | null>(
    sessions[0]?.fieldId ?? null
  );

  const selectedSessionIndex = sessions.findIndex(
    (s) => s.fieldId  === selectedSessionKey
  );

  const selectedSession =
  selectedSessionIndex >= 0 ? sessionsWithValues[selectedSessionIndex] : null;


  useEffect(() => {
    if (!selectedSessionKey && sessions.length > 0) {
      setSelectedSessionKey(sessions[0].fieldId);
    }
  }, [sessions, selectedSessionKey]);

  function addSession() {
    append({
      plan_id: initialPlan?.id ?? null,
      day_index: sessions.length + 1,
      title: "",
      notes: "",
      order_index: sessions.length,
      exercises: [],
    });
  }

  function removeSession(sessionIndex: number) {
    const removedFieldId = sessions[sessionIndex]?.fieldId;

    const nextSelectedFieldId =
      selectedSessionKey === removedFieldId
        ? sessions[sessionIndex + 1]?.fieldId ??
          sessions[sessionIndex - 1]?.fieldId ??
          null
        : selectedSessionKey;

    remove(sessionIndex);

    const nextValues = getValues("sessions")
      .filter((_, index) => index !== sessionIndex)
      .map((session, index) => ({
        ...session,
        order_index: index,
        day_index: index + 1,
      }));

    setValue("sessions", nextValues, { shouldDirty: true });

    setSelectedSessionKey(nextSelectedFieldId);
  }

  function reorderSessions(activeId: string, overId: string) {
    const oldIndex = sessions.findIndex((s) => s.fieldId === activeId);
    const newIndex = sessions.findIndex((s) => s.fieldId === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = arrayMove(getValues("sessions"), oldIndex, newIndex).map(
      (session, index) => ({
        ...session,
        order_index: index,
        day_index: index + 1,
      })
    );

    replace(reordered);
  }

  const onSave = async (values: TrainingPlanFormInput) => {
    console.log("Saving plan", values);
    const res = await saveTrainingPlanAction(values);  
    if(!res.ok) {
      setErrorMsg(res.message)
    } else {
      setErrorMsg(null);
      toast.success('Training plan saved')
      if(res.data)
        router.push(`${ROUTES.TRAINING_PLANS.ID(res.data)}`);
    }
  }

  const onError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <FormProvider {...methods}> 
        <form onSubmit={handleSubmit(onSave, onError)}>
          <TrainingPlanHeader />
          
          {errorMsg && (
            <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
          )}

          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
            <SessionSidebar
              sessions={sessionsWithValues}
              selectedSessionKey={selectedSessionKey}
              onSelectSessionKey={setSelectedSessionKey}
              onAddSession={addSession}
              onReorderSessions={reorderSessions}
            />

            <div className="min-w-0 border-t border-slate-200 bg-white lg:border-l lg:border-t-0">
              {selectedSession ? (
                <SessionEditor
                  key={selectedSession.fieldId}
                  session={selectedSession}
                  sessionIndex={selectedSessionIndex}
                  onDeleteSession={() => removeSession(selectedSessionIndex)}
                />
              ) : (
                <EmptyState
                  title="No session selected"
                  description="Create a session to start building this training plan."
                />
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}