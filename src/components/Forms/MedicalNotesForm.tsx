"use client";

import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { SearchableSelect } from "../FormElements/SearchableSelect";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { Button } from "@/components/ui-elements/button";
import { Select } from "../FormElements/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MedicalNoteCreateInput,
  MedicalNoteCreateSchema,
} from "@/lib/validation/schemas/medical-note";
import { useEffect, useState, useTransition } from "react";
import { getPersonalCoachClientsAction } from "@/app/(app)/dashboard/personal-coach/actions";
import type { ClientListRow } from "@/types/dashboard/client-records";
import type { SearchableSelectOption } from "../FormElements/SearchableSelect";

type Props = {
  onSuccess?: () => void;
};

const SEVERITY_OPTIONS: { value: string; label: string }[] = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

export default function MedicalNotesForm({ onSuccess }: Props) {
  const [clients, setClients] = useState<ClientListRow[]>([]);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MedicalNoteCreateInput>({
    mode: "onChange",
    resolver: zodResolver(MedicalNoteCreateSchema),
    defaultValues: {
      clientId: "",
      severity: "moderate",
    },
  });

  useEffect(() => {
    const loadClients = async () => {
      const res = await getPersonalCoachClientsAction();
      if (res.ok && res.data) setClients(res.data);
    };
    loadClients();
  }, []);

  const clientOptions: SearchableSelectOption[] = clients.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const onSubmit = (values: MedicalNoteCreateInput) => {
    startTransition(async () => {
      // TODO: Connect to DB
      console.log("Medical note form submitted:", values);
      onSuccess?.();
    });
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Medical Notes"
        title="Add medical note"
        subtitle="Record a client's condition, restrictions, and severity level"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Client & Condition
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <Controller
          name="clientId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Client"
              options={clientOptions}
              placeholder="Search client by name..."
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors?.clientId?.message}
            />
          )}
        />

        <InputGroup
          type="text"
          label="Condition"
          placeholder="e.g. Knee injury, Lower back pain, Hypertension"
          required
          inputProps={register("condition")}
          error={errors?.condition?.message}
        />

        <TextAreaGroup
          label="Restriction notes"
          placeholder="Describe activity restrictions, modifications, or precautions..."
          required
          textareaProps={register("restrictionNotes")}
          error={errors?.restrictionNotes?.message}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Severity
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <Select
          label={<Label value="Severity" required />}
          placeholder="Select severity"
          items={SEVERITY_OPTIONS}
          selectProps={register("severity")}
          error={errors?.severity?.message}
        />

        <Button
          type="submit"
          disabled={isPending}
          variant="primary"
          label={isPending ? "Submitting..." : "Submit"}
          className="w-full"
        />
      </form>
    </div>
  );
}
