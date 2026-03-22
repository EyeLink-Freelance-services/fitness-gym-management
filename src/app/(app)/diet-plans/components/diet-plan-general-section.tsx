"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import SectionHeader from "@/components/ui/section-header";
import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { DietPlanStatus } from "@/types/diet-plan";
import { useFormContext } from "react-hook-form";

type Props = {
  readOnly?: boolean;
};

const statusItems: { value: DietPlanStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function DietPlanGeneralSection({ readOnly }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DietPlanFormInput>();

  const status = watch("status");

  return (
    <div className="overflow-hidden rounded-[24px] border border-stroke/70 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
      <SectionHeader
        badge="General Information"
        title="Diet Plan Details"
        description="Set the title, description, and status."
      />

      <div className="p-5 md:px-6">
        <div className="space-y-4">
          <InputGroup
            label="Title"
            labelClassName="text-sm font-medium"
            type="text"
            placeholder="e.g. Lean Muscle Meal Plan"
            error={errors.title?.message}
            inputProps={{
              ...register("title"),
              readOnly,
            }}
          />

          <TextAreaGroup
            label="Description"
            labelClassName="text-sm font-medium"
            placeholder="Add a short description for this diet plan..."
            error={errors.description?.message}
            textareaProps={{
              ...register("description"),
              readOnly,
              rows: 5,
              className: "resize-none",
            }}
          />

          <Select
            label="Status"
            placeholder="Select status"
            items={statusItems}
            error={errors.status?.message}
            defaultValue={status}
            selectProps={{
              disabled: readOnly,
              onChange: (e) => {
                setValue("status", e.target.value as DietPlanStatus, {
                  shouldValidate: true,
                });
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}