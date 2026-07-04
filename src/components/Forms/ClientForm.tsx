"use client";

import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/forms/formValidation";
import type { CompanyClientFormValues } from "@/types/dashboard/company";
import { CompanyClientFormProps } from "@/types/forms";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CoachSearchSelect } from "@/components/FormElements/CoachSearchSelect";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Header, HeaderTitle } from "../FormElements/common";
import { Button } from "@/components/ui-elements/button";
import { genderOptions } from "@/data/shared";
import { DEFAULT_CLIENT_FORM_VALUES, membershipPlanOptions } from "@/data/company";
import { toast } from "sonner";
import {
  createClientAction,
  updateClientAction,
} from "@/app/(app)/dashboard/company/clients/actions";

export default function ClientForm({
  initialData,
  mode = "create",
  clientId,
  companyPlan,
  onSuccess,
}: CompanyClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CompanyClientFormValues>({
    mode: "all",
    defaultValues: {
      ...DEFAULT_CLIENT_FORM_VALUES,
      ...initialData,
    },
  });

  const membershipPlan = useWatch({ control, name: "membershipPlan" });

  useEffect(() => {
    reset({
      ...DEFAULT_CLIENT_FORM_VALUES,
      ...initialData,
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (membershipPlan === "standard") {
      setValue("additionalFees", undefined, { shouldValidate: false });
      setValue("assignedCoach", "", { shouldValidate: false });
    }
  }, [membershipPlan, setValue]);

  const onSubmit = async (data: CompanyClientFormValues) => {
    try {
      if (mode === "edit") {
        if (!clientId) throw new Error("Missing clientId for edit mode");
        await updateClientAction(clientId, data, companyPlan);
      } else {
        await createClientAction(data, companyPlan);
      }

      toast.success(
        mode === "edit"
          ? "Client updated successfully"
          : "Client created successfully",
      );
      onSuccess?.();
    } catch {
      toast.error(
        mode === "edit" ? "Failed to update client" : "Failed to create client",
      );
    }
  };

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Members"
        title={mode === "edit" ? "Edit client" : "Register client"}
        subtitle={
          mode === "edit" ? "Update client information" : "Onboard your client"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <HeaderTitle title="Personal Details" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Ovi"
            required
            inputProps={register("firstName", {
              validate: (value) =>
                validateRequired(value, "First name is required"),
            })}
            error={errors?.firstName?.message}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Joy"
            required
            inputProps={register("lastName", {
              validate: (value) =>
                validateRequired(value, "Last name is required"),
            })}
            error={errors?.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="date"
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            required
            inputProps={register("dateOfBirth", {
              validate: (value) =>
                validateRequired(value, "Date of birth is required"),
            })}
            error={errors?.dateOfBirth?.message}
          />
          <Select
            label="Gender"
            placeholder="Select"
            items={genderOptions}
            required
            error={errors.gender?.message}
            selectProps={register("gender", {
              validate: (value) =>
                validateRequired(value, "Gender is required"),
            })}
          />
        </div>

        <HeaderTitle title="Contact Details" />

        <InputGroup
          type="email"
          label="Email Address"
          placeholder="member@email.com"
          required
          inputProps={register("email", {
            required: "Email is required",
            validate: (value) => validateEmail(value),
          })}
          error={errors?.email?.message}
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phoneNumber", {
            required: "Phone number is required",
            validate: (value) => validatePhone(value),
          })}
          error={errors?.phoneNumber?.message}
        />

        <InputGroup
          type="text"
          label="Emergency Contact Name"
          placeholder="Name"
          required
          inputProps={register("emergencyContactName", {
            required: "Emergency contact name is required",
            validate: (value) => validateRequired(value, "Emergency contact name is required"),
          })}
          error={errors?.emergencyContactName?.message}
        />

          <InputGroup
            type="tel"
            label="Emergency Contact"
            placeholder="phone number +230 XXXXXX"
            required
            inputProps={register("emergencyContactPhone", {
              required: "Emergency contact number is required",
              validate: (value) => validatePhone(value),
            })}
            error={errors?.emergencyContactPhone?.message}
          />

        <HeaderTitle title="Medical Notes" />

        <TextAreaGroup
          label="Known Medical Condition"
          placeholder="e.g. Hypertension, Asthma, Knee injury, Pregnancy..."
          textareaProps={register("medicalConditions")}
        />

        <HeaderTitle title="Membership Details" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Membership Plan"
            placeholder="Select plan"
            items={membershipPlanOptions}
            error={errors.membershipPlan?.message}
            selectProps={register("membershipPlan", {
              validate: (value) =>
                validateRequired(value, "Membership plan is required"),
            })}
          />

          {membershipPlan === "personalCoach" ? (
            <InputGroup
              type="number"
              label="Personal Coaching Price"
              placeholder="200"
              required
              error={errors.additionalFees?.message}
              inputProps={{
                ...register("additionalFees", {
                  valueAsNumber: true,
                  validate: (value) => validateRequired(value, "Additional fees are required")
                }),
                min: 0,
              }}
            />
          ) : (
            <InputGroup
              type="number"
              label="Standard Price"
              placeholder="Selected plan price"
              error={errors.membershipPlan?.message}
              inputProps={{
                value: companyPlan?.standardPrice,
                readOnly: true,
                disabled: true,
              }}
            />
          )}
        </div>

        {membershipPlan === "personalCoach" && (
          <Controller
            name="assignedCoach"
            control={control}
            rules={{
              validate: (value) =>
                membershipPlan === "personalCoach"
                  ? validateRequired(value, "Coach assignment is required")
                  : true,
            }}
            render={({ field }) => (
              <CoachSearchSelect
                label="Assigned Coach"
                placeholder="Search coach by name, email, or phone..."
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.assignedCoach?.message}
              />
            )}
          />
        )}

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          label={mode === "edit" ? "Save changes" : "Create Client"}
          className="w-full"
        />
      </form>
    </div>
  );
}
