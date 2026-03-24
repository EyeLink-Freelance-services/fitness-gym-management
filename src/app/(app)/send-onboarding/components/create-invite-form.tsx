"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import {
  InviteCreateSchema,
  type InviteCreateInput,
  type InviteCreateValues,
} from "@/lib/validation/schemas/onboarding";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { createOnboardingInviteAction } from "../actions";
import InviteLink from "./invite-link";

export default function CreateInviteForm() {
  const [result, setResult] = useState<{ rawtoken?: string; email?: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InviteCreateInput, unknown, InviteCreateValues>({
    resolver: zodResolver(InviteCreateSchema),
    defaultValues: {
      email: "",
      invitation_type: "company",
      company_name: "",
      note: "",
      expires_in_days: 7,
      terms_version: "v1",
      privacy_version: "v1",
    },
  });

  const invitationType = watch("invitation_type");

  const onSubmit = async (values: InviteCreateValues) => {
    const res = await createOnboardingInviteAction(values);

    if (!res.ok) {
      console.error(res.message);
      return;
    }

    setResult({
      rawtoken: res.data?.rawToken,
      email: res.data?.email,
    });
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 shadow-theme-sm dark:border-dark-3 dark:bg-gray-dark">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputGroup
          label="Customer Email"
          type="email"
          placeholder="customer@email.com"
          inputProps={register("email")}
          error={errors.email?.message}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium text-dark dark:text-white">
            Invitation Type
          </label>
          <select
            {...register("invitation_type")}
            className="h-11 rounded-lg border border-stroke bg-transparent px-4 dark:border-dark-3"
          >
            <option value="company">Company</option>
            <option value="personal">Personal Workspace</option>
          </select>
          {errors.invitation_type && (
            <p className="text-sm text-red">{errors.invitation_type.message}</p>
          )}
        </div>

        {invitationType === "company" && (
          <InputGroup
            type="text"
            label="Suggested Company Name"
            placeholder="Gym Name"
            error={errors.company_name?.message}
            inputProps={register("company_name")}
          />
        )}

        <InputGroup
          type="number"
          label="Expires In (days)"
          inputProps={register("expires_in_days", { valueAsNumber: true })}
          error={errors.expires_in_days?.message}
        />

        <InputGroup
          type="text"
          label="Terms Version"
          inputProps={register("terms_version")}
          error={errors.terms_version?.message}
        />

        <InputGroup
          type="text"
          label="Privacy Version"
          inputProps={register("privacy_version")}
          error={errors.privacy_version?.message}
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium text-dark dark:text-white">Note</label>
          <TextAreaGroup
            label="note"
            textareaProps={register("note")}
            className="min-h-[120px] rounded-lg border border-stroke bg-transparent p-4 dark:border-dark-3"
            placeholder="Internal note"
          />
          {errors.note && <p className="text-sm text-red">{errors.note.message}</p>}
        </div>

        <Button
          type="submit"
          label={isSubmitting ? "Creating..." : "Create Invitation"}
        />
      </form>

      {result?.rawtoken && (
        <InviteLink result={result} />
      )}
    </div>
  );
}