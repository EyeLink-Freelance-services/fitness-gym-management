"use client";

import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { FieldErrors, useFormContext, UseFormRegister } from "react-hook-form";
import { MemberCreateInput } from "@/lib/validation/schemas/member";
import { useEffect, useState } from "react";

interface ICoaches {
  coach_id: string | undefined,
  company_id: string | undefined,
  label: string
}


export default function ClientForm() {
  const [coaches, setCoaches] = useState<ICoaches[]>([]);

  const { register, formState: { errors } } = useFormContext<MemberCreateInput>();

  useEffect(() => {
      const getCoaches = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coaches`, {
          method: 'GET',
          cache: 'no-store'
        })
        const json = await res.json();
        if(!json.ok) {
          console.log('no coaches')
        } else {
          console.log(json.data, 'json.data')
          setCoaches(json.data);
        }
      }
  
      getCoaches();
    }, [])
  

  return (
    <div className="form-panel bg-white dark:bg-transparent space-y-4 py-10">
      <Header
        label="- Members"
        title="New client"
        subtitle="Register a new gym member"
      />

      <div className="space-y-7">
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Personal Details
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="First Name"
            placeholder="Asha"
            required
            inputProps={register("first_name")}
            error={errors?.first_name && errors.first_name.message}
          />
          
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Ramsahoy"
            required
            inputProps={register("last_name")}
            error={errors?.last_name && errors.last_name.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="date"
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            required
            inputProps={register("dob")}
            error={errors?.dob && errors.dob.message}
          />
          <Select
            label="Gender"
            placeholder="Select"
            items={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Non-binary", label: "Non-binary" },
              { value: "Prefer not to say", label: "Prefer not to say" },
            ]}
            selectProps={register("gender")}
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Contact Details
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <InputGroup
          type="email"
          label="Email Address"
          placeholder="member@email.com"
          required
          inputProps={register("email")}
          error={errors?.email && errors.email.message}
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phone")}
          error={errors?.phone && errors.phone.message}
        />

        <InputGroup
          type="text"
          label={<Label value="Emergency Contact Name" optional />}
          placeholder="Name"
          inputProps={register("emergency_contact_name")}
        />

        <InputGroup
          type="tel"
          label="Emergency Contact"
          placeholder="phone number +230 XXXXXX"
          required
          inputProps={register("emergency_contact_phone")}
          error={errors?.emergency_contact_phone && errors.emergency_contact_phone.message}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Medical Notes
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <TextAreaGroup
          label={<Label value="Known Medical Condition" optional />}
          placeholder="e.g. Hypertension, Asthma, Knee injury, Pregnancy... Leave blank if none."
          textareaProps={register("medical_notes")}
        />

        {/* <Select
          label="Physical Activity Level"
          placeholder="Select activity level"
          items={ACTIVITY_LEVELS.map((a) => ({ value: a, label: a }))}
          selectProps={register("activityLevel", {
            required: "Activity level is required",
          })}
        /> */}

        {/* <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Membership
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <Select
          label="Membership Plan"
          placeholder="Select a plan"
          items={MEMBERSHIP_PLANS.map((p) => ({ value: p, label: p }))}
          selectProps={register("membershipPlan", {
            required: "Membership plan is required",
          })}
        /> */}

        <Select
          label={<Label value="Assigned Coach" optional />}
          defaultValue={undefined}
          placeholder="No coach assigned"
          items={[...coaches, {coach_id: undefined, label: 'No coach assigned'}].map((c) => ({ value: c.coach_id, label: c.label }))}
          selectProps={register("assigned_coach_id")}
          error={errors?.assigned_coach_id && errors.assigned_coach_id.message}
        />

        {/* <InputGroup
          type="text"
          label="Start Date"
          placeholder="DD / MM / YYYY"
          required
          inputProps={register("startDate", {
            required: "Start date is required",
          })}
        /> */}
      </div>
    </div>
  )}