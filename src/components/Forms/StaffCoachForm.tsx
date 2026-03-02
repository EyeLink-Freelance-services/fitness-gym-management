"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { StaffCoachFormData, StaffCoachFormProps } from "@/types/forms";
import { COACH_ROLES, STAFF_ROLES } from "@/data/constants";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { RadioInput } from "../FormElements/radio";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Button } from "../ui-elements/button";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/forms/formValidation";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";

export default function StaffCoachForm({
  onPersonalCoach,
}: StaffCoachFormProps) {
  const { register, handleSubmit, watch, setValue } =
    useForm<StaffCoachFormData>({
      defaultValues: {
        userType: "staff",
        gymBranch: "MyFit - Trianon",
        accessLevel: "Viewer",
      },
    });

  const userType = watch("userType");

  useEffect(() => {
    setValue("role", "");
    setValue("accessLevel", userType === "staff" ? "Viewer" : "Editor");
  }, [userType, setValue]);

  const onSubmit = (data: StaffCoachFormData) => {
    console.log(data);
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Team"
        title="Create user"
        subtitle="Add a staff member or coach to your team"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <input type="hidden" {...register("accessLevel")} />

        <div className="mb-5 space-y-2">
          <Label value="User Type" />
          <div className="grid grid-cols-2 gap-4">
            <RadioInput
              label="Staff"
              name="userType"
              value="staff"
              inputProps={register("userType")}
              minimal
            />
            <RadioInput
              label="Coach"
              name="userType"
              value="coach"
              inputProps={register("userType")}
              minimal
            />
          </div>
        </div>

        <InputGroup
          type="text"
          label="Gym / Branch"
          placeholder=""
          disabled
          inputProps={{
            ...register("gymBranch"),
            readOnly: true,
            className:
              "bg-gray-2 dark:bg-dark cursor-not-allowed text-dark-5 dark:text-dark-6",
          }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Nac"
            required
            inputProps={register("firstName", {
              validate: (v) => validateRequired(v, "First name is required"),
            })}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Joy"
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
          label="Email Address"
          placeholder="staff@yourgym.com"
          required
          inputProps={register("email", {
            required: "Email is required",
            validate: (v) => validateEmail(v),
          })}
        />

        <Select
          label="Role / Position"
          placeholder="Select a role"
          items={(userType === "staff" ? STAFF_ROLES : COACH_ROLES).map(
            (r) => ({
              value: r,
              label: r,
            }),
          )}
          selectProps={register("role", { required: "Role is required" })}
        />

        <TextAreaGroup
          label={<Label value="Notes" optional />}
          placeholder="Additional notes ..."
          textareaProps={register("notes")}
        />

        <Button type="submit" label="Create User" className="w-full" />
      </form>
    </div>
  );
}
