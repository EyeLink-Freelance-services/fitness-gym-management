import type { ComputedMetric } from "@/types/dashboard/client-records";
import { cn } from "@/lib/utils";

type ProgressSummaryCardsProps = {
  metrics: ComputedMetric[];
};

function getDisplayValue(metric: ComputedMetric) {
  if (metric.label === "Sessions") return metric.value;
  if (metric.unit === "%") return `${metric.value}%`;
  return metric.value;
}

function getArrow(metric: ComputedMetric) {
  if (metric.label.toLowerCase().includes("gain")) return "↑";
  if (metric.tone === "success") return "↓";
  if (metric.tone === "primary") return "";
  return "↑";
}

export function ProgressSummaryCards({ metrics }: ProgressSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-[12px] border border-stroke/70 bg-white px-6 py-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card"
        >
          <div
            className={cn(
              "flex items-center justify-center gap-1.5 text-[28px] font-bold tracking-tight",
              (metric.tone === "success" || metric.label.toLowerCase().includes("gain")) && "text-green",
              metric.tone === "primary" && "text-dark dark:text-white",
            )}
          >
            {getArrow(metric) && <span>{getArrow(metric)}</span>}
            <span>{getDisplayValue(metric)}</span>
          </div>
          <div className="mt-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-dark-5">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
