"use client";

import Header from "@/components/FormElements/common/header";
import { SearchableSelect } from "@/components/FormElements/SearchableSelect";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { COMPANY_CLIENT_ROWS } from "@/data/company";
import { COMPANY_COACH_ROWS } from "@/data/company-coaches";
import {
  AssignClientCreateInput,
  AssignClientCreateSchema,
} from "@/lib/validation/schemas/assign-client";
import type { AssignClientOption, AssignCoachOption } from "@/types/dashboard/assign-client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition } from "react";

const ASSIGN_CLIENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "assigned", label: "Assigned" },
  { value: "pending", label: "Pending" },
  { value: "unassigned", label: "Unassigned" },
];

interface AssignClientFormProps {
  onSuccess?: () => void;
}

export default function AssignClientForm({ onSuccess }: AssignClientFormProps) {
  const [isPending, startTransition] = useTransition();

  const clientOptions = useMemo<AssignClientOption[]>(
    () =>
      COMPANY_CLIENT_ROWS.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    [],
  );

  const coachOptions = useMemo<AssignCoachOption[]>(
    () =>
      COMPANY_COACH_ROWS.map((coach) => ({
        value: coach.id,
        label: coach.name,
      })),
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssignClientCreateInput>({
    mode: "onChange",
    resolver: zodResolver(AssignClientCreateSchema),
    defaultValues: {
      clientId: "",
      coachId: "",
      status: "assigned",
    },
  });

  const onSubmit = (values: AssignClientCreateInput) => {
    startTransition(async () => {
      // TODO: Connect to database
      console.log("Assign client form submitted:", values);
      onSuccess?.();
    });
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Client Coach Assignments"
        title="Assign Client"
        subtitle="Assign a client to a coach"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Assignment Details
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Client Name"
                options={clientOptions}
                placeholder="Search client..."
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors?.clientId?.message}
              />
            )}
          />

          <Controller
            name="coachId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Coach"
                options={coachOptions}
                placeholder="Search coach..."
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors?.coachId?.message}
              />
            )}
          />
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              placeholder="Select status"
              items={ASSIGN_CLIENT_STATUS_OPTIONS}
              selectProps={{
                ...field,
                value: field.value,
                onChange: (e) => field.onChange(e.target.value),
              }}
              error={errors?.status?.message}
            />
          )}
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
