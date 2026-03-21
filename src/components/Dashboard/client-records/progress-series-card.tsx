import type {
  ClientProgressSeries,
  ProgressSeries,
} from "@/types/dashboard/client-records";
import { BarChart } from "@/components/Dashboard/charts/bar-chart";
import { ClientProgressChart } from "@/components/Dashboard/personal-coach/client-progress-chart";

type ProgressSeriesCardProps = {
  series: ProgressSeries;
};

const strokeColorMap: Record<string, string> = {
  "bg-primary": "#5750F1",
  "bg-orange-400": "#fb923c",
  "bg-green": "#22c55e",
  "bg-yellow-400": "#facc15",
};

function toChartData(series: ProgressSeries): ClientProgressSeries[] {
  return [
    {
      id: series.id,
      clientName: series.title,
      color: strokeColorMap[series.accent] ?? "#5750F1",
      points: series.points.map((p) => ({ label: p.label, value: p.value })),
    },
  ];
}

export function ProgressSeriesCard({ series }: ProgressSeriesCardProps) {
  if (series.chartType === "line") {
    return (
      <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {series.title}
          </h3>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
            {series.subtitle}
          </p>
        </div>

        <div className="relative mt-4 h-[220px]">
          <ClientProgressChart
            data={toChartData(series)}
            height={230}
            unit={series.unit ?? ""}
            showLegend={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div>
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {series.title}
        </h3>
        <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
          {series.subtitle}
        </p>
      </div>

      <div>
        <BarChart
          labels={series.points.map((p) => p.label)}
          series={[
            {
              name: "Fat",
              data: series.points.map((p) => p.secondaryValue ?? 0),
              color: "#fb923c",
            },
            {
              name: "Lean",
              data: series.points.map((p) => p.value),
              color: "#22c55e",
            },
          ]}
          stacked={false}
          height={230}
          tooltipUnits={["kg", "kg"]}
        />
      </div>
    </div>
  );
}
