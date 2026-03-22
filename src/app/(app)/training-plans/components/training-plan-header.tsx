import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { TrainingPlanFormInput } from "@/lib/validation/schemas/training-plans";
import { TrainingPlanStatus } from "@/types/training-plan";
import { useFormContext } from "react-hook-form";

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
    <div className="bg-gradient-to-b from-white via-gray-1/70 to-gray-1 dark:border-dark-3 dark:from-dark dark:via-dark dark:to-dark-2">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-stroke/70 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/85">
          <div className="relative">

            <div className="relative flex flex-col gap-6 p-5 xl:flex-row xl:items-start xl:justify-between xl:gap-8">
              <div className="min-w-0 flex-1 space-y-5">
                <div className="space-y-2">
                  
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Training Builder
                  </div>

                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-dark dark:text-white md:text-2xl">
                      Training Plan Overview
                    </h1>
                    <p className="mt-1 text-sm leading-6 text-dark-5 dark:text-dark-6">
                      Create a structured training plan with a clear title,
                      description, and publishing status.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="rounded-2xl border border-stroke/70 bg-white/80 p-4 dark:border-dark-3 dark:bg-dark">
                    <InputGroup
                      label="Plan Title"
                      type="text"
                      placeholder="e.g. 12-Week Strength Program"
                      error={errors.title?.message}
                      inputProps={{
                        ...register("title"),
                        className:
                          "border-0 bg-transparent px-0 text-xl font-semibold shadow-none placeholder:text-dark-5 focus-visible:ring-0 dark:bg-transparent",
                      }}
                    />
                  </div>

                  <div className="rounded-2xl border border-stroke/70 bg-white/80 p-4 dark:border-dark-3 dark:bg-dark">
                    <TextAreaGroup
                      label="Description"
                      placeholder="Add a short description for this training plan..."
                      error={errors.description?.message}
                      textareaProps={{
                        ...register("description"),
                        rows: 4,
                        className:
                          "resize-none border-0 bg-transparent px-0 shadow-none placeholder:text-dark-5 focus-visible:ring-0 dark:bg-transparent",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="xl:w-[340px]">
                <div className="rounded-3xl border border-stroke/70 bg-gradient-to-b from-gray-1 to-white p-5 shadow-sm dark:border-dark-3 dark:from-dark dark:to-dark-2">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                      Publishing
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-dark dark:text-white">
                      Plan Status
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-dark-5 dark:text-dark-6">
                      Choose whether this plan stays in draft, becomes visible,
                      or gets archived.
                    </p>
                  </div>

                  <div className="mb-5 rounded-2xl border border-stroke/70 bg-white px-4 py-4 dark:border-dark-3 dark:bg-dark">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
                      Current status
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${statusStyles[status as TrainingPlanStatus]}`}
                      >
                        {status}
                      </span>

                      <div className="text-right">
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {status === "draft" && "Not yet published"}
                          {status === "published" && "Ready for members"}
                          {status === "archived" && "Stored for later"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Select
                      label="Change status"
                      placeholder="Select status"
                      items={statusItems}
                      error={errors.status?.message}
                      defaultValue={status}
                      selectProps={{
                        onChange: (e) => {
                          setValue(
                            "status",
                            e.target.value as TrainingPlanStatus,
                            { shouldValidate: true }
                          );
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      label={isSubmitting ? "Saving..." : "Save Plan"}
                      className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}