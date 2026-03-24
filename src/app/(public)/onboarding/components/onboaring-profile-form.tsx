"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import {
  OnboardingProfileSchema,
  type OnboardingProfileInput,
  type OnboardingProfileValues,
} from "@/lib/validation/schemas/onboarding";
import { completeOnboardingAction } from "../actions";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { COMPANY_STATES } from "@/data/dashboardForm";
import { Select } from "@/components/FormElements/select";
import { ImageUpload } from "@/components/FormElements/ImageUpload";
import { OnboardingInviteRow } from "@/lib/db/types";

type Props = {
  token: string;
  invite: OnboardingInviteRow;
};

export default function OnboardingProfileForm({ token, invite }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingProfileInput, unknown, OnboardingProfileValues>({
    mode:"onChange",
    resolver: zodResolver(OnboardingProfileSchema),
    defaultValues: {
      token,
      first_name: "",
      last_name: "",
      picture_url: "",
      phone: "",
      company_name: invite.company_name ?? "",
      company_contact_email: invite.email ?? "",
      company_logo_url: "",
      company_contact_phone: "",
      company_brn: "",
      company_address: "",
      company_city: "",
      company_post_code: "",
      company_region: "",
      company_terms: "",
      company_disclaimer: ""
    },
  });

  const onSubmit = async (values: OnboardingProfileValues) => {
    const res = await completeOnboardingAction(values);

    if (!res.ok) {
      console.error(res.message);
      return;
    }

    router.push("/onboarding/success");
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-6 shadow-theme-sm 
      dark:border-dark-3 dark:bg-gray-dark">

      <h1 className="mb-5 text-2xl font-semibold text-dark dark:text-white">
        Complete your onboarding
      </h1>

      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>

        {/* PERSONAL INFO */}
        <InputGroup
          type="text"
          label="First Name"
          inputProps={register("first_name")}
          error={errors.first_name?.message}
        />

        <InputGroup
          type="text"
          label="Last Name"
          inputProps={register("last_name")}
          error={errors.last_name?.message}
        />

        <InputGroup
          type="text"
          label="Phone"
          inputProps={register("phone")}
          error={errors.phone?.message}
        />

        {/* COMPANY SECTION */}
        {invite.invitation_type === "company" && (
          <>
            {/* Section divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
              <span className="text-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
                Company Information
              </span>
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
            </div>

            <InputGroup
              type="text"
              label="Company Name"
              required
              inputProps={register("company_name")}
              error={errors.company_name?.message}
            />

            <InputGroup
              type="tel"
              label="Company Contact Number"
              placeholder="+230 5XXX XXXX"
              required
              error={errors.company_contact_phone?.message}
              inputProps={register("company_contact_phone")}
            />

            <InputGroup
              type="email"
              label="Company Email"
              required
              inputProps={register("company_contact_email")}
              error={errors.company_contact_email?.message}
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
              registerReturn={register("company_logo_url")}
              setValue={setValue as (name: string, value?: FileList) => void}
            />

            {/* BUSINESS */}
              <InputGroup
                type="text"
                label="BRN / Business Reg. No."
                placeholder="202401234567"
                required
                error={errors.company_brn?.message}
                inputProps={register("company_brn")}
              />

            {/* LOCATION */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
              <span className="text-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
                Location
              </span>
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
            </div>

            <InputGroup
              type="text"
              label="Address"
              placeholder="123 Trianon Avenue"
              required
              error={errors.company_address?.message}
              inputProps={register("company_address")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputGroup
                type="text"
                label="City"
                placeholder="Port Louis"
                required
                error={errors.company_city?.message}
                inputProps={register("company_city")}
              />

              <InputGroup
                type="text"
                label="Postcode"
                placeholder="00000"
                error={errors.company_post_code?.message}
                inputProps={register("company_post_code")}
              />
            </div>

            <Controller
              name="company_region"
              control={control}
              rules={{ required: "District is required" }}
              render={({ field }) => (
                <Select
                  label="District / Region"
                  placeholder="Select district"
                  items={COMPANY_STATES.map((s) => ({ value: s, label: s }))}
                  error={errors.company_region?.message}
                  selectProps={{
                    ...field,
                    required: true,
                  }}
                />
              )}
            />

            {/* LEGAL */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
              <span className="text-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
                Legal
              </span>
              <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
            </div>

            <TextAreaGroup
              label="Company Terms Text"
              placeholder="Enter your organization terms..."
              textareaProps={register("company_terms")}
            />

            <TextAreaGroup
              label="Company Disclaimer Text"
              placeholder="Enter your organization disclaimer..."
              textareaProps={register("company_disclaimer")}
            />
          </>
        )}

        {/* BUTTON */}
        <Button
          type="submit"
          label={isSubmitting ? "Completing..." : "Complete Onboarding"}
        />
      </form>
    </div>
  );
}