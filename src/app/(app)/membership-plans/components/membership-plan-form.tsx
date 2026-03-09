"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import InputGroup from "@/components/FormElements/InputGroup";
import Label from "@/components/FormElements/common/label";
import Header from "@/components/FormElements/common/header";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";

export type MembershipPlanFormValues = {
  name: string;
  price: number;
  entree_fee: number;
  duration_days: number;
  is_monthly: boolean;
  description?: string | null;
  features?: {
    value: string;
  }[];
  is_active: boolean;
};

type Props = {
  form: UseFormReturn<MembershipPlanFormValues>;
};

export default function MembershipPlanForm({ form }: Props) {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const isMonthly = form.watch("is_monthly");
  const durationValue = form.watch("duration_days");

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
      <Header
        label="- Membership Plan"
        title="Plan Details"
        subtitle="Configure the plan name, price, duration, and availability."
      />

      <InputGroup
        label="Plan Name"
        type="text"
        placeholder="Basic Monthly"
        error={form.formState.errors.name?.message}
        inputProps={form.register("name")}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InputGroup
          label="Price"
          type="number"
          placeholder="0.00"
          error={form.formState.errors.price?.message}
          inputProps={{
            ...form.register("price", { valueAsNumber: true }),
            step: "0.01",
            min: "0",
          }}
        />

        <InputGroup
          label="Entry Fee"
          type="number"
          placeholder="0.00"
          error={form.formState.errors.entree_fee?.message}
          inputProps={{
            ...form.register("entree_fee", { valueAsNumber: true }),
            step: "0.01",
            min: "0",
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Billing Type"
          placeholder="Select billing type"
          defaultValue={isMonthly ? "monthly" : "custom"}
          items={[
            { value: "monthly", label: "Monthly" },
            { value: "custom", label: "Custom" },
          ]}
          selectProps={{
            value: isMonthly ? "monthly" : "custom",
            onChange: (e) => {
              const monthly = e.target.value === "monthly";

              form.setValue("is_monthly", monthly, {
                shouldValidate: true,
                shouldDirty: true,
              });

              if (monthly) {
                const current = Number(form.getValues("duration_days"));
                if (!current || current % 30 !== 0) {
                  form.setValue("duration_days", 30, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }
            },
          }}
        />

        {isMonthly ? (
          <Select
            label="Duration (days)"
            placeholder="Select duration"
            defaultValue={String(durationValue ?? 30)}
            error={form.formState.errors.duration_days?.message}
            items={[
              { value: "30", label: "30 days (1 month)" },
              { value: "60", label: "60 days (2 months)" },
              { value: "90", label: "90 days (3 months)" },
              { value: "180", label: "180 days (6 months)" },
              { value: "360", label: "360 days (12 months)" },
            ]}
            selectProps={{
              value: String(durationValue ?? 30),
              onChange: (e) =>
                form.setValue("duration_days", Number(e.target.value), {
                  shouldValidate: true,
                  shouldDirty: true,
                }),
            }}
          />
        ) : (
          <InputGroup
            label="Duration (days)"
            type="number"
            placeholder="Enter number of days"
            error={form.formState.errors.duration_days?.message}
            inputProps={{
              ...form.register("duration_days", { valueAsNumber: true }),
              min: "1",
              step: "1",
            }}
          />
        )}
      </div>

      <div>
        <TextAreaGroup
          label="Description"
          placeholder="Enter description"
          error={form.formState.errors.description?.message}
          textareaProps={{
            ...form.register("description"),
            rows: 4,
          }}
        />
      </div>

      <div>
        <Label
          as="label"
          htmlFor="features-0"
          value="Features"
        />

        <div className="mb-2 mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Define available features for this plan
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              Add feature
            </button>

            <button
              type="button"
              onClick={() => form.resetField("features")}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              Reset Feature
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1">
                <InputGroup
                  id={`features-${index}`}
                  label=""
                  type="text"
                  placeholder={`Feature ${index + 1}`}
                  error={form.formState.errors.features?.[index]?.value?.message}
                  inputProps={form.register(`features.${index}.value`)}
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="h-fit rounded-lg border px-3 py-3 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {"message" in (form.formState.errors.features ?? {}) &&
          typeof form.formState.errors.features?.message === "string" && (
            <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">
              {form.formState.errors.features.message}
            </p>
          )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={!!form.watch("is_active")}
          onChange={(e) =>
            form.setValue("is_active", e.target.checked, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Active plan
        </label>
      </div>
    </div>
  );
}