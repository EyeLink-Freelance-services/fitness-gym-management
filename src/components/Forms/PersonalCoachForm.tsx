"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SPECIALIZATIONS, AVAILABILITY_OPTIONS } from "@/data/dashboardForm";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Button } from "../ui-elements/button";
import Header from "../FormElements/common/header";
import { CreateCompanyCoachInput, CreateCompanyCoachSchema, CreateCompanyCoachValues } from "@/lib/validation/schemas/coach";

type Props = {
  onSubmit?: (values: CreateCompanyCoachValues) => Promise<void> | void;
};

export default function PersonalCoachForm({
  onSubmit,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyCoachInput, unknown, CreateCompanyCoachValues>({
    resolver: zodResolver(CreateCompanyCoachSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialization: "",
      certifications: "",
      year_exp: undefined,
      bio: "",
      availability: "",
      status: "active",
    },
  });

  const handleFormSubmit = async (data: CreateCompanyCoachValues) => {
    console.log(data);

    if (onSubmit) {
      await onSubmit(data);
    }
  };

  const onError = (error: unknown) => {
    console.log(error, "error");
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Coaches"
        title="Register coach"
        subtitle="Onboard an independent personal trainer"
      />

      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="space-y-4"
      >

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Coach"
            required
            error={errors.first_name?.message}
            inputProps={register("first_name")}
          />

          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Smith"
            required
            error={errors.last_name?.message}
            inputProps={register("last_name")}
          />
        </div>

        <InputGroup
          type="email"
          label="Email"
          placeholder="coach@email.com"
          required
          error={errors.email?.message}
          inputProps={register("email")}
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phone")}
          error={errors?.phone?.message}
        />

        <Controller
          name="specialization"
          control={control}
          render={({ field }) => (
            <Select
              label="Specialization"
              placeholder="Select specialization"
              items={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
              error={errors.specialization?.message}
              selectProps={{
                ...field,
                value: field.value ?? "",
                required: true,
              }}
            />
          )}
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
          error={errors.certifications?.message}
          inputProps={register("certifications")}
        />

        <InputGroup
          type="number"
          label="Years of Experience"
          placeholder="5"
          error={errors.year_exp?.message}
          inputProps={register("year_exp")}
        />

        <TextAreaGroup
          label="Bio / Profile Summary"
          placeholder="Brief introduction about this coach's training philosophy, background, and approach..."
          error={errors.bio?.message}
          textareaProps={register("bio")}
        />

        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <Select
              label="Availability"
              placeholder="Select availability"
              items={AVAILABILITY_OPTIONS.map((a) => ({
                value: a,
                label: a,
              }))}
              error={errors.availability?.message}
              selectProps={{
                ...field,
                value: field.value ?? "",
                required: true,
              }}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              placeholder="Select status"
              items={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              error={errors.status?.message}
              selectProps={{
                ...field,
                value: field.value ?? "active",
              }}
            />
          )}
        />

        <Button
          type="submit"
          label={isSubmitting ? "Creating..." : "Register"}
          className="w-full"
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}