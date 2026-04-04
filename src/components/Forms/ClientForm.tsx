"use client";

import { DUMMY_COACHES, DUMMY_GYMS } from "@/data/superAdmin";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/lib/forms/formValidation";
import { ClientFormData, CompanyClientFormProps } from "@/types/forms";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import Header from "../FormElements/common/header";
import Label from "../FormElements/common/label";
import { Checkbox } from "../FormElements/checkbox";
import { Button } from "@/components/ui-elements/button";

function getDisplayPrice(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

export default function ClientForm({
  clientContext = "company",
  initialData,
  mode = "create",
  onSuccess,
}: CompanyClientFormProps) {
  const companyPricing = DUMMY_GYMS[0];
  const coachPricing = DUMMY_COACHES[0];

  const defaultStandardPrice =
    clientContext === "company"
      ? companyPricing?.standardPrice
      : coachPricing?.hourlyRate;
  const premiumPrice =
    clientContext === "company" && companyPricing?.hasPremiumPlan
      ? companyPricing.premiumPrice
      : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ClientFormData>({
    mode: "all",
    // resolver: zodResolver(MemberCreateSchema),
    defaultValues: {
      //companyid
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalConditions: "",
      membershipPlan: "standard",
      membershipPrice: undefined,
      customFee: undefined,
      assignedCoach: "",
      startDate: "",
      agreeTerms: false,
      ...initialData,
    },
  });

  const membershipPlan = watch("membershipPlan");
  const customFee = watch("customFee");
  const membershipPrice = watch("membershipPrice");

  useEffect(() => {
    const nextMembershipPlan = initialData?.membershipPlan?.trim() || "standard";

    reset({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalConditions: "",
      membershipPlan: nextMembershipPlan,
      membershipPrice: undefined,
      customFee: undefined,
      assignedCoach: "",
      startDate: "",
      agreeTerms: false,
      ...initialData,
    });
  }, [initialData, reset]);

  useEffect(() => {
    if (!membershipPlan) {
      setValue("membershipPlan", "standard", { shouldValidate: true });
    }
  }, [membershipPlan, setValue]);

  useEffect(() => {
    if (
      clientContext === "company" &&
      membershipPlan === "premium" &&
      !companyPricing?.hasPremiumPlan
    ) {
      setValue("membershipPlan", "standard", { shouldValidate: true });
    }
  }, [clientContext, companyPricing?.hasPremiumPlan, membershipPlan, setValue]);

  useEffect(() => {
    if (membershipPlan !== "custom") {
      setValue("customFee", undefined, { shouldValidate: false });
    }
  }, [membershipPlan, setValue]);

  useEffect(() => {
    let nextMembershipPrice: number | undefined;

    if (clientContext === "personal") {
      nextMembershipPrice =
        membershipPlan === "custom" ? customFee : defaultStandardPrice;
    } else {
      nextMembershipPrice =
        membershipPlan === "premium" ? premiumPrice : defaultStandardPrice;
    }

    setValue("membershipPrice", nextMembershipPrice, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [
    clientContext,
    customFee,
    defaultStandardPrice,
    membershipPlan,
    premiumPrice,
    setValue,
  ]);

  const onSubmit = (data: ClientFormData) => {
    console.log(data);
    onSuccess?.();
  };

  const membershipPlanOptions =
    clientContext === "personal"
      ? [
          { value: "standard", label: "Standard" },
          { value: "custom", label: "Custom" },
        ]
      : [
          { value: "standard", label: "Standard" },
          ...(companyPricing?.hasPremiumPlan
            ? [{ value: "premium", label: "Premium" }]
            : []),
        ];

  const membershipPriceLabel =
    clientContext === "personal"
      ? membershipPlan === "custom"
        ? "Custom Fee"
        : "Hourly Rate"
      : "Selected Price";

  const membershipPriceError =
    membershipPrice === undefined ? "Price is not available from the mock data" : undefined;

  return (
    <div className="form-panel space-y-4 bg-white py-10 dark:bg-transparent">
      <Header
        label="- Members"
        title={mode === "edit" ? "Edit client" : "Register client"}
        subtitle={
          mode === "edit" ? "Update client information" : "Onboard your client"
        }
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
            inputProps={register("firstName", {
              validate: (value) =>
                validateRequired(value, "First name is required"),
            })}
            error={errors?.firstName?.message}
          />
          <InputGroup
            type="text"
            label="Last Name"
            placeholder="Ramsahoy"
            required
            inputProps={register("lastName", {
              validate: (value) =>
                validateRequired(value, "Last name is required"),
            })}
            error={errors?.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            type="date"
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            required
            inputProps={register("dateOfBirth", {
              validate: (value) =>
                validateRequired(value, "Date of birth is required"),
            })}
            error={errors?.dateOfBirth?.message}
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
            error={errors.gender?.message}
            selectProps={register("gender", {
              validate: (value) => validateRequired(value, "Gender is required"),
            })}
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
          inputProps={register("email", {
            required: "Email is required",
            validate: (value) => validateEmail(value),
          })}
          error={errors?.email?.message}
        />

        <InputGroup
          type="tel"
          label="Phone Number"
          placeholder="+230 5XXX XXXX"
          required
          inputProps={register("phone", {
            required: "Phone number is required",
            validate: (value) => validatePhone(value),
          })}
          error={errors?.phone?.message}
        />

        <InputGroup
          type="text"
          label={<Label value="Emergency Contact Name" optional />}
          placeholder="Name"
          inputProps={register("emergencyContactName")}
        />

        <InputGroup
          type="tel"
          label="Emergency Contact"
          placeholder="phone number +230 XXXXXX"
          required
          inputProps={register("emergencyContactPhone", {
            required: "Emergency contact number is required",
            validate: (value) => validatePhone(value),
          })}
          error={errors?.emergencyContactPhone?.message}
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
          textareaProps={register("medicalConditions")}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
          <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
            Membership
          </span>
          <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Membership Plan"
            placeholder="Select plan"
            items={membershipPlanOptions}
            error={errors.membershipPlan?.message}
            selectProps={register("membershipPlan", {
              validate: (value) =>
                validateRequired(value, "Membership plan is required"),
            })}
          />

          {clientContext === "personal" && membershipPlan === "custom" ? (
            <InputGroup
              type="number"
              label={membershipPriceLabel}
              placeholder="200"
              required
              error={errors.customFee?.message}
              inputProps={{
                ...register("customFee", {
                  valueAsNumber: true,
                  validate: (value) =>
                    membershipPlan === "custom"
                      ? validateRequired(value, "Custom fee is required")
                      : true,
                }),
                min: 0,
              }}
            />
          ) : (
            <InputGroup
              type="number"
              label={membershipPriceLabel}
              placeholder={
                clientContext === "personal" ? "Coach hourly rate" : "Selected plan price"
              }
              error={membershipPriceError}
              inputProps={{
                value: getDisplayPrice(
                  membershipPlan === "premium" ? premiumPrice : defaultStandardPrice,
                ),
                readOnly: true,
                disabled: true,
              }}
            />
          )}
        </div>

        <input
          type="hidden"
          {...register("membershipPrice", {
            validate: (value) =>
              validateRequired(value, "Membership price is required"),
          })}
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
            inputProps={register("agreeTerms", {
              validate: (v) => (v ? true : "You must agree to the terms"),
            })}
            error={errors.agreeTerms?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          // variant={!agreeTerms ? "disabled" : "primary"}
          label={mode === "edit" ? "Update Client" : "Create Client"}
          className="w-full"
        />
      </form>
    </div>
  );
}
