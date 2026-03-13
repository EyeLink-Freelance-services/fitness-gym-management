import { TrainingPlanStatus } from "@/types/training-plan";

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

export default function TrainingPlanHeader({
  title,
  description,
  status,
  onChangeTitle,
  onChangeDescription,
  onChangeStatus,
  onSave,
}: Props) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-3">
            <input
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Training plan title"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xl font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <textarea
              value={description ?? ""}
              onChange={(e) => onChangeDescription(e.target.value)}
              placeholder="Add a short description..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="flex flex-col gap-3 lg:w-[280px]">
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
                {status}
              </span>
            </div>

            <select
              value={status}
              onChange={(e) => onChangeStatus(e.target.value as TrainingPlanStatus)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button
              type="button"
              onClick={onSave}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}