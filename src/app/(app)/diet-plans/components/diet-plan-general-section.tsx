"use client";

import { DietPlanFormInput } from "@/lib/validation/schemas/diet-plans";
import { useFormContext } from "react-hook-form";

type Props = {
  readOnly?: boolean;
};

export default function DietPlanGeneralSection({ readOnly }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<DietPlanFormInput>();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold">General information</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <input
            {...register("title")}
            readOnly={readOnly}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950"
            placeholder="e.g. Lean muscle meal plan"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            readOnly={readOnly}
            rows={5}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950"
            placeholder="Optional description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            disabled={readOnly}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}