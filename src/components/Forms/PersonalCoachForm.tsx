"use client";

import { useForm } from "react-hook-form";
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
import Label from "../FormElements/common/label";

export default function PersonalCoachForm() {
  const { register, handleSubmit } = useForm<PersonalCoachFormData>();

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
        // Todo: Make it a multi-select
        <Select
          label="Specialization / Role"
          placeholder="Select specialization"
          items={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
          selectProps={register("specialization", {
            required: "Specialization is required",
          })}
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
        <div className="mb-5">
          <Label value="Profile Photo" optional />
          <div
            className="cursor-pointer rounded-lg border border-dashed border-stroke bg-gray-2 p-6 text-center transition hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
            onClick={(e) =>
              (
                e.currentTarget.querySelector("input") as HTMLInputElement
              )?.click()
            }
          >
            <input type="file" accept="image/*" className="hidden" />
            <p className="text-body-sm text-dark-5 dark:text-dark-6">
              Upload coach photo —{" "}
              <strong className="text-dark dark:text-white">browse</strong>
            </p>
          </div>
        </div>
        <Select
          label="Availability"
          placeholder="Select availability"
          items={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: a }))}
          selectProps={register("availability", {
            required: "Availability is required",
          })}
        />
        <Button type="submit" label="Register" className="w-full" />
      </form>
    </div>
  );
}
