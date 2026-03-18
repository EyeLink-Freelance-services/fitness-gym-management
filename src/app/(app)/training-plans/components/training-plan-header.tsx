import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";
import { TrainingPlanStatus } from "@/types/training-plan";
import { useFormContext } from "react-hook-form";

type Props = {
  title: string;
  description: string | null;
  status: TrainingPlanStatus;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeStatus: (value: TrainingPlanStatus) => void;
  onSave: () => void;
};

const statusStyles: Record<TrainingPlanStatus, string> = {
  draft: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  published: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  archived: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

const statusItems: { value: TrainingPlanStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function TrainingPlanHeader() {
  const {register, setValue, watch, formState: {errors, isSubmitting}} = useFormContext<TrainingPlanFormInput>();
  const status = watch("status")

  return (
    <div className="border-b border-stroke bg-white dark:border-dark-3 dark:bg-dark">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-4">
            <InputGroup
              label=""
              type="text"
              placeholder="Training plan title"
              error={errors.title?.message}
              inputProps={{
                ...register('title'),
                className: "text-xl font-semibold",
              }}
            />

            <TextAreaGroup
              label=""
              placeholder="Add a short description..."
              error={errors.description?.message}
              textareaProps={{
                ...register('description'),
                rows: 3,
                className: "resize-none",
              }}
            />
          </div>

          <div className="flex flex-col gap-4 lg:w-[280px]">
            <div>
              <p className="text-lg font-medium text-dark dark:text-white">
                Current status
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[status as TrainingPlanStatus]}`}
                >
                  {status}
                </span>
              </div>
            </div>

            <Select
              label=""
              placeholder="Select status"
              items={statusItems}
              error={errors.status?.message}
              defaultValue={status}
              selectProps={{
                onChange: (e) => {
                  setValue('status', e.target.value as TrainingPlanStatus, {shouldValidate: true})
                }
              }}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              label={isSubmitting ? 'Saving...' : 'Save Plan'}
              className="rounded-lg bg-primary text-md font-medium text-white transition hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}