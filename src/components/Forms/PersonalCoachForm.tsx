"use client";

import { Controller, useForm } from "react-hook-form";
import { ImageUpload } from "../FormElements/ImageUpload";
import type { PersonalCoachFormData } from "@/types/forms";
import { SPECIALIZATIONS, AVAILABILITY_OPTIONS } from "@/data/dashboardForm";
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

export default function PersonalCoachForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PersonalCoachFormData>({ mode: "all" });

  watch();

  const onSubmit = (data: PersonalCoachFormData) => {
    console.log(data);
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Coaches"
        title="Register coach"
        subtitle="Onboard an independent personal trainer"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Coach 1"
            required
            inputProps={register("firstName", {
              validate: (v) => validateRequired(v, "First name is required"),
            })}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Coach 1"
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
          label="Email"
          placeholder="coach@email.com"
          required
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
        <InputGroup
          type="text"
          label="Operating Location"
          placeholder="e.g. Port Louis branch / Home visits / Online"
          required
          inputProps={register("operatingLocation", {
            validate: (v) =>
              validateRequired(v, "Operating location is required"),
          })}
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
          required
          inputProps={register("certifications", {
            validate: (v) => validateRequired(v, "Certifications are required"),
          })}
        />
        <InputGroup
          type="number"
          label="Years of Experience"
          placeholder="5"
          inputProps={{
            ...register("yearsExperience", { valueAsNumber: true }),
            min: 0,
            max: 50,
          }}
        />
        <InputGroup
          type="number"
          label="Hourly Rate"
          placeholder="150"
          inputProps={{
            ...register("hourlyRate", { valueAsNumber: true }),
            min: 0,
          }}
        />
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
          textareaProps={register("bio", { required: "Bio is required" })}
        />
        <ImageUpload
          label="Profile Photo"
          optional
          accept="image/*"
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
        <Controller
          name="availability"
          control={control}
          rules={{ required: "Availability is required" }}
          render={({ field }) => (
            <Select
              label="Availability"
              placeholder="Select availability"
              items={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: a }))}
              error={errors.availability?.message}
              selectProps={{ ...field, required: true }}
            />
          )}
        />
        <Button
          type="submit"
          label="Register"
          className="w-full"
          disabled={!isValid || isSubmitting}
        />
      </form>
    </div>
  );
}
