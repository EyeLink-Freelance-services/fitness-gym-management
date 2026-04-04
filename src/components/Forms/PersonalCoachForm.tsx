"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImageUpload } from "../FormElements/ImageUpload";
import type { PersonalCoachFormData, PersonalCoachFormProps } from "@/types/forms";
import {
  SPECIALIZATIONS,
  AVAILABILITY_OPTIONS,
  COACHING_MODES,
} from "@/data/dashboardForm";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Button } from "../ui-elements/button";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/forms/formValidation";
import Header from "../FormElements/common/header";

export default function PersonalCoachForm({
  initialData,
  existingProfilePhotoUrl,
  mode = "create",
  context = "super-admin",
  onSuccess,
}: PersonalCoachFormProps) {
  const isCompanyContext = context === "company";
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PersonalCoachFormData>({
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      specialization: "",
      coachingMode: isCompanyContext ? "Company coach" : "",
      location: "",
      certifications: "",
      hourlyRate: isCompanyContext ? 0 : (undefined as unknown as number),
      yearsExperience: undefined,
      languages: "",
      bio: "",
      availability: isCompanyContext ? "Assigned by company" : "",
      ...initialData,
    },
  });

  useEffect(() => {
    reset({
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      specialization: "",
      coachingMode: isCompanyContext ? "Company coach" : "",
      location: "",
      certifications: "",
      hourlyRate: isCompanyContext ? 0 : (undefined as unknown as number),
      yearsExperience: undefined,
      languages: "",
      bio: "",
      availability: isCompanyContext ? "Assigned by company" : "",
      ...initialData,
    });
  }, [initialData, isCompanyContext, reset]);

  watch();

  const onSubmit = (data: PersonalCoachFormData) => {
    console.log(data);
    onSuccess?.();
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Coaches"
        title={mode === "edit" ? "Edit coach" : "Register coach"}
        subtitle={
          mode === "edit"
            ? isCompanyContext
              ? "Update the company coach details"
              : "Update the personal trainer details"
            : isCompanyContext
              ? "Add a coach to your company roster"
              : "Onboard an independent personal trainer"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="John"
            required
            inputProps={register("firstName", {
              validate: (v) => validateRequired(v, "First name is required"),
            })}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Doe"
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
          error={errors.contactNumber?.message}
          inputProps={register("contactNumber", {
            required: "Contact number is required",
            validate: (v) => validatePhone(v),
          })}
        />
        <InputGroup
          type="email"
          label="Email"
          placeholder="coach@email.com"
          required
          error={errors.email?.message}
          inputProps={register("email", {
            required: "Email is required",
            validate: (v) => validateEmail(v),
          })}
        />

        <Controller
          name="specialization"
          control={control}
          rules={{ required: "Specialization is required" }}
          render={({ field }) => (
            <Select
              label="Specialization / Role"
              placeholder="Select specialization"
              items={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
              error={errors.specialization?.message}
              selectProps={{ ...field, required: true }}
            />
          )}
        />

        {!isCompanyContext && (
          <Controller
            name="coachingMode"
            control={control}
            rules={{ required: "Coaching mode is required" }}
            render={({ field }) => (
              <Select
                label="Coaching Mode"
                placeholder="Select coaching mode"
                items={COACHING_MODES.map((m) => ({ value: m, label: m }))}
                error={errors.coachingMode?.message}
                selectProps={{ ...field, required: true }}
              />
            )}
          />
        )}

        <InputGroup
          type="text"
          label="Location"
          placeholder="e.g. Port Louis/ Quatre-Bornes"
          inputProps={register("location")}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Qualifications
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>
        <InputGroup
          type="text"
          label="Certifications"
          placeholder="e.g. ACE-CPT, NASM, CrossFit L2"
          inputProps={register("certifications")}
        />
        <InputGroup
          type="number"
          label="Years of Experience"
          placeholder="5"
          inputProps={{
            ...register("yearsExperience", {
              setValueAs: (v) => (v === "" ? "" : Number(v)),
            }),
            min: 0,
            max: 60,
          }}
        />
        {!isCompanyContext && (
          <InputGroup
            type="number"
            label="Hourly Rate"
            placeholder="150"
            required
            inputProps={{
              ...register("hourlyRate", {
                valueAsNumber: true,
                validate: (v) => validateRequired(v, "Hourly rate is required"),
              }),
              min: 0,
            }}
          />
        )}
        <InputGroup
          type="text"
          label="Languages Spoken"
          placeholder="English, French, Kreol Morisien"
          required
          inputProps={register("languages", {
            validate: (v) => validateRequired(v, "Languages are required"),
          })}
        />
        <TextAreaGroup
          label="Bio / Profile Summary"
          placeholder="Brief introduction about this coach's training philosophy, background, and approach..."
          required
          textareaProps={register("bio", { required: "Bio is required" })}
        />
        <ImageUpload
          label="Profile Photo"
          optional
          accept="image/*"
          initialPreviewUrl={existingProfilePhotoUrl}
          emptyStateText={
            <>
              Upload coach photo -{" "}
              <strong className="text-dark dark:text-white">browse</strong>
            </>
          }
          hint="PNG, JPG, SVG - max 5MB"
          registerReturn={register("profilePhoto")}
          setValue={setValue as (name: string, value?: FileList) => void}
        />
        {!isCompanyContext && (
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <Select
                label="Availability"
                placeholder="Select availability"
                items={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: a }))}
                error={errors.availability?.message}
                selectProps={{
                  ...field,
                  value: field.value || "",
                }}
              />
            )}
          />
        )}
        <Button
          type="submit"
          label={mode === "edit" ? "Save Changes" : "Register"}
          className="w-full"
          disabled={!isValid || isSubmitting}
        />
      </form>
    </div>
  );
}
