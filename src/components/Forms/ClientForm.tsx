"use client";

import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { Checkbox } from "../FormElements/checkbox";
import { Button } from "@/components/ui-elements/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberCreateInput, MemberCreateSchema } from "@/lib/validation/schemas/member";
import { useEffect, useState, useTransition } from "react";
import { useCompany } from "@/app/context/company-context";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import {
  createMemberAction,
  createMemberWithMembershipPlanAction,
} from "@/app/(app)/members/actions";
import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import { formatDateLocal } from "@/lib/formatters/format-date";
import {
  MemberMembershipCreateInput,
  MemberMembershipStatusSchema,
} from "@/lib/validation/schemas/member-membership";
import MembershipPlansSelector from "@/app/(app)/membership-plans/components/membership-plan-selector";

interface ICoaches {
  coach_id: string | undefined;
  company_id: string | undefined;
  label: string;
}

type Props = {
  onSuccess?: () => void;
};

export default function ClientForm({ onSuccess }: Props) {
  const { id, mode } = useCompany();
  const [coaches, setCoaches] = useState<ICoaches[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlanRow | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberCreateInput>({
    mode: "onChange",
    resolver: zodResolver(MemberCreateSchema),
    defaultValues: {
      company_id: id,
      assigned_coach_id: null,
      status: "active",
    },
  });

  useEffect(() => {
    const getCoaches = async () => {
      if(mode !== 'personal') {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/coaches`,
          { method: "GET", cache: "no-store" },
        );
        const json = await res.json();
        if (json.ok) {
          setCoaches(json.data);
        }
      };
    }
    getCoaches();
  }, []);

  const onSubmit = (values: MemberCreateInput) => {
    const payloadMember: MemberCreateInput = {
      ...values,
      assigned_coach_id: values.assigned_coach_id || null,
    };

    if (selectedPlan?.id) {
      const today = new Date();
      const end = new Date(today);
      end.setDate(end.getDate() + selectedPlan.duration_days);

      const payloadWithMembershipPlan: MemberMembershipCreateInput = {
        plan_id: selectedPlan.id,
        start_date: formatDateLocal(today),
        end_date: formatDateLocal(end),
        status: MemberMembershipStatusSchema.parse("active"),
      };

      startTransition(async () => {
        const res = await createMemberWithMembershipPlanAction(
          payloadMember,
          payloadWithMembershipPlan,
        );
        if (!res.ok) {
          setErrorMsg(res.message);
        } else {
          onSuccess?.();
          if (!onSuccess) {
            router.push(ROUTES.MEMBERS.ID(res.data[0].member_id));
          }
        }
      });
    } else {
      startTransition(async () => {
        const res = await createMemberAction(payloadMember);
        if (!res.ok) {
          setErrorMsg(res.message);
        } else {
          onSuccess?.();
          if (!onSuccess) {
            router.push(ROUTES.MEMBERS.ID(res.data.id));
          }
        }
      });
    }
  };

  const coachItems = [
    ...coaches.map((c) => ({ value: c.coach_id ?? "", label: c.label })),
    { value: "", label: "No coach assigned" },
  ];

  return (
    <div className="form-panel bg-white dark:bg-transparent space-y-4 py-10">
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
            error={errors?.first_name?.message}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Ramsahoy"
            required
            inputProps={register("last_name")}
            error={errors?.last_name?.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="date"
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            required
            inputProps={register("dob")}
            error={errors?.dob?.message}
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
          error={errors?.email?.message}
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phone")}
          error={errors?.phone?.message}
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
          error={errors?.emergency_contact_phone?.message}
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

        { mode !== 'personal' && (
          <Select
            label={<Label value="Assigned Coach" optional />}
            placeholder="No coach assigned"
            items={coachItems}
            selectProps={register("assigned_coach_id")}
            error={errors?.assigned_coach_id?.message}
          />
        )}

        <MembershipPlansSelector
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />

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

        <div className="py-6">
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

        {errorMsg && (
          <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
        )}

        <Button
          type="submit"
          disabled={!agreeTerms || isPending}
          variant={!agreeTerms ? "disabled" : "primary"}
          label={isPending ? "Saving..." : "Register Client"}
          className="w-full"
        />
      </form>
    </div>
  );
}
