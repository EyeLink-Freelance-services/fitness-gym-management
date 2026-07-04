"use client";

import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import type { CompanyStaffFormProps, StaffFormData } from "@/types/forms";
import { STAFF_ROLES } from "@/data/dashboardForm";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Button } from "../ui-elements/button";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/forms/formValidation";
import { Header } from "../FormElements/common";
import Label from "../FormElements/common/label";

export default function StaffForm({
  initialData,
  mode = "create",
  onSuccess,
}: CompanyStaffFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<StaffFormData>({
    mode: "all",
    defaultValues: {
      gymBranch: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      role: "",
      notes: "",
      ...initialData,
    },
  });

  useEffect(() => {
    reset({
      gymBranch: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      role: "",
      notes: "",
      ...initialData,
    });
  }, [initialData, reset]);

  useEffect(() => {
    setValue("role", "");
  }, [setValue]);

  const onSubmit = async (_data: StaffFormData) => {
    await onSuccess?.();
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Team"
        title={mode === "edit" ? "Edit staff" : "Register staff"}
        subtitle={
          mode === "edit" ? "Update the staff details" : "Onboard a staff"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <InputGroup
          type="text"
          label="Gym / Branch"
          placeholder=""
          disabled
          inputProps={{
            ...register("gymBranch"),
            readOnly: true,
            className:
              "bg-gray-2 dark:bg-dark cursor-not-allowed text-dark-5 dark:text-dark-6",
          }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Nac"
            required
            inputProps={register("firstName", {
              validate: (v) => validateRequired(v, "First name is required"),
            })}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Joy"
            required
            inputProps={register("lastName", {
              validate: (v) => validateRequired(v, "Last name is required"),
            })}
          />
        </div>

        <InputGroup
          type="tel"
          label="Contact Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("contactNumber", {
            required: "Contact number is required",
            validate: (v) => validatePhone(v),
          })}
        />

        <InputGroup
          type="email"
          label="Email Address"
          placeholder="staff@yourgym.com"
          required
          inputProps={register("email", {
            required: "Email is required",
            validate: (v) => validateEmail(v),
          })}
        />

        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <Select
              label="Role / Position"
              placeholder="Select a role"
              items={STAFF_ROLES.map((r) => ({ value: r, label: r }))}
              error={errors.role?.message}
              selectProps={{ ...field, required: true }}
            />
          )}
        />

        <TextAreaGroup
          label={<Label value="Notes" optional />}
          placeholder="Additional notes ..."
          textareaProps={register("notes")}
        />

        <Button
          type="submit"
          label={mode === "edit" ? "Update Staff" : "Create Staff"}
          loadingLabel={mode === "edit" ? "Saving..." : "Creating..."}
          loading={isSubmitting}
          className="w-full"
          disabled={!isValid}
        />
      </form>
    </div>
  );
}
