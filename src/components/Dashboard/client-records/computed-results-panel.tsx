import { StatusBadge } from "@/components/ui-elements/status-badge";
import type { ComputedMetric, FormulaSnapshotPreview } from "@/types/dashboard/client-records";

type ComputedResultsPanelProps = {
  title?: string;
  metrics: ComputedMetric[];
  previousMetrics?: ComputedMetric[];
  snapshots?: FormulaSnapshotPreview[];
};

function getDeltaTone(delta?: number) {
  if (delta === undefined) {
    return "neutral";
  }

  if (delta < 0) {
    return "success";
  }

  if (delta > 0) {
    return "warning";
  }

  return "neutral";
}

function formatDelta(delta?: number) {
  if (delta === undefined) {
    return "—";
  }

  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}`;
}

export function ComputedResultsPanel({
  title = "Formula Results",
  metrics,
  previousMetrics,
  snapshots,
}: ComputedResultsPanelProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[12px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-semibold text-dark dark:text-white">{title}</h3>
          </div>
          <StatusBadge label="Live" tone="success" />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/50"
            >
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5">
                {metric.label}
              </div>
              <div className="mt-2 text-[15px] font-bold text-primary">
                {metric.value}
              </div>
              {metric.unit && (
                <div className="mt-0.5 text-[10px] text-dark-6 dark:text-dark-5">
                  {metric.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {previousMetrics && (
        <section className="rounded-[12px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-[16px] font-semibold text-dark dark:text-white">
            vs Previous Session
          </h3>
          <div className="mt-3 grid gap-2.5">
            {metrics.map((metric, index) => (
              <div
                key={metric.id}
                className="flex items-center justify-between gap-2 text-[12px]"
              >
                <span className="text-dark-6 dark:text-dark-5">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-dark dark:text-white tabular-nums">
                    {metric.value}
                  </span>
                  <StatusBadge
                    label={formatDelta(metric.delta)}
                    tone={getDeltaTone(metric.delta)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {snapshots && (
        <section className="rounded-[12px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-[16px] font-semibold text-dark dark:text-white">
            Formula Snapshot
          </h3>
          <div className="mt-3 grid gap-3">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    {snapshot.label}
                  </span>
                  <span className="text-[10px] text-dark-5">{snapshot.version}</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-dark-5">
                  Results are snapshotted on save. Changing a formula later will not
                  alter this record.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
