import type { ComputedMetric } from "@/types/dashboard/client-records";
import { OverviewCard } from "../overview-cards/card";

type ProgressSummaryCardsProps = {
  metrics: ComputedMetric[];
};

function getDisplayValue(metric: ComputedMetric) {
  if (metric.label === "Sessions") return metric.value;
  if (metric.unit === "%") return `${metric.value}%`;
  return `${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`;
}

function getArrow(metric: ComputedMetric): "up" | "down" | undefined {
  const label = metric.label.toLowerCase();
  if (label.includes("gain")) return "up";
  if (label.includes("lost") || label.includes("loss")) return "down";
  if (metric.tone === "primary") return undefined;
  return undefined;
}

export function ProgressSummaryCards({ metrics }: ProgressSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const arrow = getArrow(metric);
        return (
          <OverviewCard
            key={metric.id}
            label={metric.label}
            data={{
              value: getDisplayValue(metric),
              ...(arrow && { arrow }),
            }}
          />
        );
      })}
    </div>
  );
}
