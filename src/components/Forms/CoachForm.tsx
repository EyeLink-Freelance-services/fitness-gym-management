"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "../FormElements/ImageUpload";
import type { CoachFormData, CoachFormProps } from "@/types/forms";
import InputGroup from "../FormElements/InputGroup";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Button } from "../ui-elements/button";
import { validateEmail, validatePhone, validateRequired} from "@/lib/forms/formValidation";
import { Header } from "../FormElements/common";
import { createCoachAction, updateCoachAction} from "@/app/(app)/dashboard/company/coaches/actions";
import { toast } from "sonner";

export default function CoachForm({
  initialData,
  existingProfilePhotoUrl,
  mode = "create",
  coachId,
  onSuccess,
}: CoachFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CoachFormData>({
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      specialization: "",
      coachingMode: "Company coach",
      location: "",
      certifications: "",
      hourlyRate: 0,
      yearsExperience: undefined,
      languages: "",
      bio: "",
      availability: "Assigned by company",
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
      coachingMode: "Company coach",
      location: "",
      certifications: "",
      hourlyRate: 0,
      yearsExperience: undefined,
      languages: "",
      bio: "",
      availability: "Assigned by company",
      profilePhoto: undefined,
      ...initialData,
    });
  }, [initialData, reset]);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const onSubmit = async (data: CoachFormData) => {
    try {
      const payload = {
        ...data,
        profilePhoto,
      };

      if (mode === "edit" && coachId) {
        await updateCoachAction(coachId, payload);
        toast.success("Coach updated successfully");
      } else {
        await createCoachAction(payload);
        toast.success("Coach created successfully");
      }

      await onSuccess?.();
    } catch {
      toast.error(
        mode === "edit" ? "Failed to update coach" : "Failed to create coach",
      );
    }
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Coaches"
        title={mode === "edit" ? "Edit coach" : "Register coach"}
        subtitle={
          mode === "edit"
            ? "Update the company coach details"
            : "Add a coach to your company roster"
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
              setValueAs: (v) => (v === "" ? null : Number(v)),
            }),
            min: 0,
            max: 60,
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
          required
          textareaProps={register("bio", { required: "Bio is required" })}
        />

        <ImageUpload
          label="Profile Photo"
          accept="image/*"
          initialPreviewUrl={existingProfilePhotoUrl}
          onFileChange={setProfilePhoto}
          hint="PNG, JPG, SVG - max 5MB"
        />

        <Button
          type="submit"
          label={mode === "edit" ? "Save Changes" : "Register"}
          loadingLabel={mode === "edit" ? "Saving..." : "Creating..."}
          loading={isSubmitting}
          className="w-full"
          disabled={!isValid}
        />
      </form>
    </div>
  );
}
