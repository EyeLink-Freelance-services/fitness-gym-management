"use client";

import { useForm } from "react-hook-form";
import type { ClientFormData } from "@/types/forms";
import {
  MEMBERSHIP_PLANS,
  ACTIVITY_LEVELS,
  COACH_OPTIONS,
} from "@/data/constants";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { Checkbox } from "../FormElements/checkbox";
import { Button } from "../ui-elements/button";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { MemberCreateInput, MemberCreateSchema } from "@/lib/validation/schemas/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

interface ICoaches {
  coach_id: string,
  company_id: string,
  label: string
}

export default function ClientForm() {
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [coaches, setCoaches] = useState<ICoaches[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberCreateInput>({
    resolver: zodResolver(MemberCreateSchema),
    defaultValues: {
      status: "active",
    },
  });

  useEffect(() => {
    const getCoaches = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coaches`, {
        method: 'GET',
        cache: 'no-store'
      })
      const json = await res.json();
      if(!json.ok) {
        setErrorMsg(json.message);
      } else {
        console.log(json.data, 'json.data')
        setCoaches(json.data);
      }
    }

    getCoaches();
  }, [])

  const onSubmit = async (values: MemberCreateInput) => {
    console.log(values);
  };

  return (
    <div className="form-panel space-y-4">
      <Header
        label="- Members"
        title="New client"
        subtitle="Register a new gym member"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
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
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Ramsahoy"
            required
            inputProps={register("last_name")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="text"
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            required
            inputProps={register("dob")}
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
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phone")}
        />

        <InputGroup
          type="text"
          label="Emergency Contact Name"
          placeholder="Name"
          required
          inputProps={register("emergency_contact_name")}
        />

        <InputGroup
          type="text"
          label="Emergency Contact"
          placeholder="phone number"
          required
          inputProps={register("emergency_contact_phone")}
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
          placeholder="No coach assigned"
          items={coaches.map((c) => ({ value: c.coach_id, label: c.label }))}
          selectProps={register("assigned_coach_id")}
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

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Agreement
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="max-h-32 overflow-y-auto rounded-lg border border-stroke bg-gray-2 p-4 text-body-sm leading-relaxed text-dark-5 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6">
          The undersigned acknowledges that physical exercise involves inherent
          risks of injury. By registering as a member, I voluntarily assume
          these risks. I confirm that I am in adequate physical condition to
          participate in gym activities.
        </div>

        <div className="mb-5">
          <Checkbox
            minimal
            radius="md"
            label={
              <span className="text-body-sm text-dark-5 dark:text-dark-6">
                I confirm the member has read, understood, and accepted the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms &amp; Conditions
                </a>
                , and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAgreeTerms(e.target.checked)
            }
          />
        </div>

        <Button type="submit" label="Register Client" className="w-full" />
      </form>
    </div>
  );
}
