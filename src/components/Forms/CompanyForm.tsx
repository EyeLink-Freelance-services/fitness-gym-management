"use client";

import { useFieldArray, useForm } from "react-hook-form";
import type { CompanyFormData } from "@/types/forms";
import { COMPANY_STATES } from "@/data/constants";
import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Select } from "../FormElements/select";
import { Checkbox } from "../FormElements/checkbox";
import { Button } from "../ui-elements/button";
import { validatePhone, validateRequired } from "@/lib/forms/formValidation";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";

export default function CompanyForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    defaultValues: {
      branches: [{ value: "MyFit- Trianon" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const onSubmit = (data: CompanyFormData) => {
    console.log(data);
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Organization"
        title="Register your gym"
        subtitle="Set up your organization to get started"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Basic Info
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="text"
          label="Company Name"
          placeholder="MyFit Gym"
          required
          error={errors.companyName?.message}
          inputProps={register("companyName", {
            validate: (v) => validateRequired(v, "Company name is required"),
          })}
        />

        <div className="mb-5">
          <Label value="Company Logo" />
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
              Drop your logo here or{" "}
              <strong className="text-dark dark:text-white">
                browse files
              </strong>
            </p>
            <p className="mt-1 text-body-xs text-dark-5 dark:text-dark-6">
              PNG, JPG, SVG — max 5MB
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="BRN / Business Reg. No."
            placeholder="202401234567"
            required
            error={errors.brn?.message}
            inputProps={register("brn", {
              validate: (v) => validateRequired(v, "BRN is required"),
            })}
          />
          <InputGroup
            type="tel"
            label="Contact Number"
            placeholder="+230 5XXX XXXX"
            required
            error={errors.contactNumber?.message}
            inputProps={register("contactNumber", {
              validate: (v) =>
                validateRequired(v, "Contact number is required") === true
                  ? validatePhone(String(v))
                  : "Contact number is required",
            })}
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Location
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="text"
          label="Address Line 1"
          placeholder="123 Trianon Avenue"
          required
          error={errors.addressLine1?.message}
          inputProps={register("addressLine1", {
            validate: (v) => validateRequired(v, "Address is required"),
          })}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="City"
            placeholder="Port Louis"
            required
            error={errors.city?.message}
            inputProps={register("city", {
              validate: (v) => validateRequired(v, "City is required"),
            })}
          />
          <InputGroup
            type="text"
            label="Postcode"
            placeholder="00000"
            required
            error={errors.postcode?.message}
            inputProps={register("postcode", {
              validate: (v) => validateRequired(v, "Postcode is required"),
            })}
          />
        </div>

        <Select
          label="District / Region"
          placeholder="Select district"
          items={COMPANY_STATES.map((s) => ({ value: s, label: s }))}
          error={errors.state?.message}
          selectProps={register("state", { required: "District is required" })}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <Label value="Multi-Branch" optional />
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  i === 0
                    ? "Branch name (e.g. HQ — KL Sentral)"
                    : "Branch name (e.g. Petaling Jaya)"
                }
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                {...register(`branches.${i}.value` as const)}
              />
              <Button
                type="button"
                label="✕"
                variant="outlineDark"
                size="small"
                className="shrink-0 !px-3 !py-2 text-red-500 hover:bg-red-500/10"
                onClick={() => fields.length > 1 && remove(i)}
                aria-label={`Remove branch ${i + 1}`}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          label="+ Add Another Branch"
          variant="outlineDark"
          className="w-full border-dashed text-dark-5 hover:border-primary hover:text-primary dark:text-dark-6 dark:hover:text-primary"
          onClick={() => append({ value: "" })}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Legal
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <TextAreaGroup
          label="Disclaimer Text"
          placeholder="Enter your organization disclaimer..."
          textareaProps={register("disclaimer")}
        />

        <div className="mb-5">
          <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
            Terms &amp; Conditions
          </label>
          <div className="max-h-32 overflow-y-auto rounded-lg border border-stroke bg-gray-2 p-4 text-body-sm leading-relaxed text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
            By registering on this platform, the company
            (&quot;Registrant&quot;) acknowledges and agrees that all data
            provided shall be used strictly for the purpose of gym management
            operations. Registrant warrants that all information submitted is
            accurate and complete.
          </div>
          <div className="mt-3">
            <Checkbox
              minimal
              radius="md"
              label={
                <span className="text-body-sm text-dark-5 dark:text-dark-6">
                  I have read and agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </span>
              }
              inputProps={register("agreeTerms", {
                validate: (v) => (v ? true : "You must agree to the terms"),
              })}
              error={errors.agreeTerms?.message}
            />
          </div>
        </div>

        <Button type="submit" label="Register Company" className="w-full" />
      </form>
    </div>
  );
}
