"use client";

import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";

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

export default function MembershipPlanForm({
  form
}: Props) {	
	
	const { fields, append, remove, replace } = useFieldArray({
		control: form.control,
		name: "features",
	});
	
  const isMonthly = form.watch("is_monthly");

  return (
    <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Plan Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure the plan name, price, duration, and availability.
        </p>
      </div>

      <Field label="Plan name" error={form.formState.errors.name?.message}>
        <Input {...form.register("name")} placeholder="Basic Monthly" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Price" error={form.formState.errors.price?.message}>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...form.register("price", { valueAsNumber: true })}
          />
        </Field>

        <Field label="Entry Fee" error={form.formState.errors.entree_fee?.message}>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...form.register("entree_fee", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Billing Type">
          <Select
            value={isMonthly ? "monthly" : "custom"}
            onChange={(e) => {
              const monthly = e.target.value === "monthly";
              form.setValue("is_monthly", monthly, {
                shouldValidate: true,
              });

              if (monthly) {
                const current = Number(form.getValues("duration_days"));
                if (!current || current % 30 !== 0) {
                  form.setValue("duration_days", 30, {
                    shouldValidate: true,
                  });
                }
              }
            }}
          >
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </Select>
        </Field>

        <Field label="Duration (days)" error={form.formState.errors.duration_days?.message}>
          {isMonthly ? (
            <Select
              value={String(form.watch("duration_days") ?? 30)}
              onChange={(e) =>
                form.setValue("duration_days", Number(e.target.value), {
                  shouldValidate: true,
                })
              }
            >
              <option value="30">30 days (1 month)</option>
              <option value="60">60 days (2 months)</option>
              <option value="90">90 days (3 months)</option>
              <option value="180">180 days (6 months)</option>
              <option value="360">360 days (12 months)</option>
            </Select>
          ) : (
            <Input
              type="number"
              min="1"
              step="1"
              {...form.register("duration_days", { valueAsNumber: true })}
            />
          )}
        </Field>
      </div>

      <Field label="Description" error={form.formState.errors.description?.message}>
        <Textarea rows={4} {...form.register("description")} />
      </Field>
			<Field label="Features" error={form.formState.errors.features?.message}>
        <div className="mb-2 flex items-center justify-between">
					<span className="text-sm">
						Define available features for this plan
					</span>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => append({value: ''})}
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

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...form.register(`features.${index}.value`)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder={`Feature ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={!!form.watch("is_active")}
          onChange={(e) =>
            form.setValue("is_active", e.target.checked, {
              shouldValidate: true,
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