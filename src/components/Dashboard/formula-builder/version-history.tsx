import { StatusBadge } from "@/components/ui-elements/status-badge";
import type { FormulaVersionSummary } from "@/types/dashboard/formula-builder";

type VersionHistoryProps = {
  versions: FormulaVersionSummary[];
};

export function VersionHistory({ versions }: VersionHistoryProps) {
  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-5">
          Version History
        </h3>
      </div>

      <div className="grid gap-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className="rounded-[10px] border border-stroke/70 p-4 dark:border-dark-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    {version.version}
                  </span>
                  {version.isActive && (
                    <StatusBadge label="Active" tone="success" />
                  )}
                </div>
                <p className="mt-1 text-xs text-dark-6 dark:text-dark-5">
                  {version.expression}
                </p>
                <p className="mt-1 text-[11px] text-dark-5">
                  {new Date(version.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} · {version.recordCount} records
                </p>
              </div>
              {!version.isActive && (
                <button
                  type="button"
                  className="rounded-[8px] border border-dark-3 px-3 py-1.5 text-xs font-medium text-dark-6 hover:border-primary hover:text-primary dark:text-dark-5"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
