"use client";

import { SearchableSelect } from "@/components/FormElements/SearchableSelect";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { getCompanyCoachOptions } from "@/app/(app)/dashboard/company/coaches/actions";
import { COMPANY_CLIENT_ROWS } from "@/data/company";
import { getCompanyClientFullName } from "@/modules/company/company-client.mappers";
import {
  AssignClientCreateInput,
  AssignClientCreateSchema,
} from "@/lib/validation/schemas/assign-client";
import type { AssignClientOption, AssignCoachOption } from "@/types/dashboard/assign-client";
import type { AssignClientFormProps } from "@/types/forms";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Header } from "../FormElements/common";

const ASSIGN_CLIENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "assigned", label: "Assigned" },
  { value: "pending", label: "Pending" },
  { value: "unassigned", label: "Unassigned" },
];

const defaultValues: AssignClientCreateInput = {
  clientId: "",
  coachId: "",
  status: "assigned",
};

export default function AssignClientForm({
  initialData,
  mode = "create",
  onSuccess,
}: AssignClientFormProps) {
  const [isPending, startTransition] = useTransition();

  const clientOptions = useMemo<AssignClientOption[]>(
    () =>
      COMPANY_CLIENT_ROWS.map((client) => ({
        value: client.id,
        label: getCompanyClientFullName(client),
      })),
    [],
  );

  const [coachOptions, setCoachOptions] = useState<AssignCoachOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    void getCompanyCoachOptions().then((options) => {
      if (isMounted) {
        setCoachOptions(options);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AssignClientCreateInput>({
    mode: "onChange",
    resolver: zodResolver(AssignClientCreateSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    reset({
      ...defaultValues,
      ...initialData,
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (selectedStatus === "unassigned") {
      setValue("coachId", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [selectedStatus, setValue]);

  const onSubmit = (values: AssignClientCreateInput) => {
    startTransition(async () => {
      console.log(
        mode === "edit"
          ? "Assign client form updated:"
          : "Assign client form submitted:",
        values,
      );
      onSuccess?.();
    });
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Client Coach Assignments"
        title={mode === "edit" ? "Edit assignment" : "Assign client"}
        subtitle={
          mode === "edit"
            ? "Update the selected client-coach assignment"
            : "Assign a client to a coach"
        }
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
                placeholder={
                  selectedStatus === "unassigned"
                    ? "No coach needed for unassigned status"
                    : "Search coach..."
                }
                required={selectedStatus !== "unassigned"}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={selectedStatus === "unassigned"}
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
          label={
            isPending
              ? mode === "edit"
                ? "Saving..."
                : "Submitting..."
              : mode === "edit"
                ? "Save Changes"
                : "Submit"
          }
          className="w-full"
        />
      </form>
    </div>
  );
}
