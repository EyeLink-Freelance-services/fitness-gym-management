"use client";

import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { COMPANY_STATES } from "@/data/dashboardForm";
import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Select } from "../FormElements/select";
import { Button } from "../ui-elements/button";
import { ImageUpload } from "../FormElements/ImageUpload";
import Header from "../FormElements/common/header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { CompanyCreateInput, CompanyCreateSchema } from "@/lib/validation/schemas/company";
import { createCompanyAction } from "@/app/(app)/companies/action";
import { toast } from "sonner";

type Props = {
  onSuccess?: () => void;
};

export default function CompanyForm({ onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const method = useForm<CompanyCreateInput>({
    mode: "onChange",
    resolver: zodResolver(CompanyCreateSchema),
    defaultValues: {
      name: "",
      mode: "company",
      logo_url: "",
      brn: "",
      address: "",
      city: "",
      post_code: "",
      region: "",
      contact_email: "",
      contact_phone: "",
      terms: "",
      disclaimer: "",
    },
  });

  const { handleSubmit, control, register, formState: { errors, isSubmitting }, setValue } = method;

  const onSubmit = (data: CompanyCreateInput) => {
    console.log(data, 'data');
    startTransition(async () => {
      const res = await createCompanyAction(
        data
      );
      if (!res.ok) {
        toast.error(res.message)
      } else {
        onSuccess?.();
        toast.success(res.message)
        if (!onSuccess) {
          router.push(ROUTES.DASHBOARD.SUPER_ADMIN.ROOT);
        }
      }
    });
  };

  const onError = (error: any) => {
    console.log(error, " errors");
  }

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Organization"
        title="Register your gym"
        subtitle="Set up your organization to get started"
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-7">
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
          error={errors.name?.message}
          inputProps={register("name")}
        />

        <ImageUpload
          label="Company Logo"
          accept="image/*"
          emptyStateText={
            <>
              Drop your logo here or{" "}
              <strong className="text-dark dark:text-white">
                browse files
              </strong>
            </>
          }
          hint="PNG, JPG, SVG - max 5MB"
          registerReturn={register("logo_url")}
          setValue={setValue as (name: string, value?: FileList) => void}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="BRN / Business Reg. No."
            placeholder="202401234567"
            required
            error={errors.brn?.message}
            inputProps={register("brn")}
          />
          <InputGroup
            type="tel"
            label="Contact Number"
            placeholder="+230 5XXX XXXX"
            required
            error={errors.contact_phone?.message}
            inputProps={register("contact_phone")}
          />
        </div>
        <InputGroup
          type="email"
          label="Email Address"
          placeholder="member@email.com"
          required
          inputProps={register("contact_email")}
          error={errors?.contact_email?.message}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Location
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="text"
          label="Address"
          placeholder="123 Trianon Avenue"
          required
          error={errors.address?.message}
          inputProps={register("address")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="City"
            placeholder="Port Louis"
            required
            error={errors.city?.message}
            inputProps={register("city")}
          />
          <InputGroup
            type="text"
            label="Postcode"
            placeholder="00000"
            error={errors.post_code?.message}
            inputProps={register("post_code")}
          />
        </div>

        <Controller
          name="region"
          control={control}
          rules={{ required: "District is required" }}
          render={({ field }) => (
            <Select
              label="District / Region"
              placeholder="Select district"
              items={COMPANY_STATES.map((s) => ({ value: s, label: s }))}
              error={errors.region?.message}
              selectProps={{
                ...field,
                required: true,
              }}
            />
          )}
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

        {/* <div className="mb-5">
          <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
            Terms &amp; Conditions <span className="text-red">*</span>
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
                  </a>{" "}
                  <span className="text-red">*</span>
                </span>
              }
              inputProps={register("terms", {
                validate: (v) => (v ? true : "You must agree to the terms"),
              })}
              error={errors.agreeTerms?.message}
            />
          </div>
        </div> */}

        <Button
          type="submit"
          label={isPending ? "Saving..." : "Register Client"}
          className="w-full"
          disabled={ isSubmitting }
        />
      </form>
    </div>
  );
}
