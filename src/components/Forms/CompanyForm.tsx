"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { CompanyFormData, CompanyFormProps } from "@/types/forms";
import { COMPANY_STATES } from "@/data/dashboardForm";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { Checkbox } from "../FormElements/checkbox";
import { Button } from "../ui-elements/button";
import { ImageUpload } from "../FormElements/ImageUpload";
import { validatePhone, validateRequired } from "@/lib/forms/formValidation";
import Label from "../FormElements/common/label";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { fileToBase64 } from "@/utils/dashboard/shared";
import { DEFAULT_COMPANY_FORM_VALUES } from "@/data/superAdmin";
import {
  createCompanyAction,
  updateCompanyAction,
} from "@/app/(app)/dashboard/super-admin/company/actions";
import { Header, HeaderTitle } from "../FormElements/common";

export default function CompanyForm({
  initialData,
  existingProfilePhotoUrl,
  mode = "create",
  companyId,
  onSuccess,
}: CompanyFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CompanyFormData>({
    mode: "all",
    defaultValues: {
      ...DEFAULT_COMPANY_FORM_VALUES,
      ...initialData,
    },
  });

  const branches = watch("branches");
  const hasPremiumPlan = watch("hasPersonalCoachingPrice");

  useEffect(() => {
    reset({
      ...DEFAULT_COMPANY_FORM_VALUES,
      ...initialData,
      logo: undefined,
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (!hasPremiumPlan) {
      setValue("personalCoachingPrice", undefined, { shouldValidate: true });
    }
  }, [hasPremiumPlan, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  const logoRef = useRef<File | null>(null);
  const canAddBranch = branches.every(
    (branch) => branch.branchName.trim().length > 0,
  );

  const onSubmit = async (data: CompanyFormData) => {
    console.log("Payload sent to backend:", data);
    try {
      let logoBase64: string | null = null;
      if (logoRef.current) {
        logoBase64 = await fileToBase64(logoRef.current);
      }

      const logo = logoBase64 ?? existingProfilePhotoUrl ?? data.logo ?? null;
      const payload = { ...data, logo };

      if (mode === "edit") {
        if (!companyId) throw new Error("Missing companyId for edit mode");
        await updateCompanyAction(companyId, payload);
      } else {
        await createCompanyAction(payload);
      }

      toast.success(
        mode === "edit"
          ? "Company updated successfully"
          : "Company created successfully",
      );
      onSuccess?.();
    } catch {
      toast.error(
        mode === "edit"
          ? "Failed to update company"
          : "Failed to create company",
      );
    }
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Organization"
        title={mode === "edit" ? "Edit company" : "Register company"}
        subtitle={
          mode === "edit"
            ? "Update the company details"
            : "Onboard your company details"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <HeaderTitle title="Basic Info" />

        <InputGroup
          type="text"
          label="Company Name"
          placeholder="Gym"
          required
          error={errors.companyName?.message}
          inputProps={register("companyName", {
            validate: (v) => validateRequired(v, "Company name is required"),
          })}
        />

        <InputGroup
          type="text"
          label="Company Email"
          placeholder="company@gmail.com"
          required
          error={errors.email?.message}
          inputProps={register("email", {
            validate: (v) => validateRequired(v, "Company email is required"),
          })}
        />

        <ImageUpload
          label="Company Logo"
          accept="image/*"
          initialPreviewUrl={existingProfilePhotoUrl}
          onFileChange={(file) => {
            logoRef.current = file;
          }}
          hint="PNG, JPG, SVG - max 5MB"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="BRN / Business Reg. No."
            placeholder="C00000000"
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

        <HeaderTitle title="Location" />

        <InputGroup
          type="text"
          label="Address Line 1"
          placeholder="Street address"
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

        <Controller
          name="state"
          control={control}
          rules={{ required: "District is required" }}
          render={({ field }) => (
            <Select
              label="District / Region"
              placeholder="Select district"
              items={COMPANY_STATES.map((s) => ({ value: s, label: s }))}
              error={errors.state?.message}
              selectProps={{
                ...field,
                required: true,
              }}
            />
          )}
        />

        <HeaderTitle title="Membership Pricing" />

        <div className="grid grid-cols-1 gap-4">
          <InputGroup
            type="number"
            label="Standard Price(Rs)"
            placeholder="150"
            required
            error={errors.standardPrice?.message}
            inputProps={{
              ...register("standardPrice", {
                valueAsNumber: true,
                validate: (value) =>
                  validateRequired(value, "Standard price is required"),
              }),
              min: 0,
            }}
          />
          <div className="flex items-end">
            <Checkbox
              minimal
              radius="md"
              label="Premium Plan"
              inputProps={register("hasPersonalCoachingPrice")}
            />
          </div>
        </div>

        {hasPremiumPlan && (
          <InputGroup
            type="number"
            label="Personal Coaching Price(Rs)"
            placeholder="250"
            required
            error={errors.personalCoachingPrice?.message}
            inputProps={{
              ...register("personalCoachingPrice", {
                valueAsNumber: true,
                validate: (value) =>
                  hasPremiumPlan
                    ? validateRequired(value, "Personal coaching price is required")
                    : true,
              }),
              min: 0,
            }}
          />
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <Label value="Multi-Branch" optional />
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="space-y-1">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={"Branch name (e.g. Gym 1)"}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                {...register(`branches.${i}.branchName` as const)}
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
          onClick={() => canAddBranch && append({ branchName: "" })}
          disabled={!canAddBranch}
        />

        <Button
          type="submit"
          label={mode === "edit" ? "Save changes" : "Register company"}
          className="w-full"
          disabled={!isValid || isSubmitting}
        />
      </form>
    </div>
  );
}
