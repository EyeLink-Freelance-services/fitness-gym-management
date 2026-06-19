import { StatusBadge } from "@/components/ui-elements/status-badge";
import type {
  ComputedMetric,
  FormulaSnapshotPreview,
} from "@/types/dashboard/client-records";

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
    return "-";
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
            <h3 className="text-[18px] font-semibold text-dark dark:text-white">
              {title}
            </h3>
          </div>
          <StatusBadge label="Live" tone="success" />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/50"
            >
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
                {metric.label}
              </div>
              <div className="mt-2 text-[15px] font-bold text-primary dark:text-white">
                {metric.value}
              </div>
              {metric.unit && (
                <div className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">
                  {metric.unit}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* {previousMetrics && (
        <section className="rounded-[12px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-[16px] font-semibold text-dark dark:text-white">
            vs Previous Session
          </h3>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/50"
              >
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
                  {metric.label}
                </div>
                <div className="mt-2 flex justify-between text-[15px] font-bold text-primary dark:text-white">
                  <p>
                    {metric.value}
                    {metric.unit && (
                      <span className="text-[12px] text-dark-5 dark:text-dark-6">
                        {metric.unit}
                      </span>
                    )}
                  </p>

                  <StatusBadge
                    label={formatDelta(metric.delta)}
                    tone={getDeltaTone(metric.delta)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}
