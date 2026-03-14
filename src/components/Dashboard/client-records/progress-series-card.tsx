import { cn } from "@/lib/utils";
import type { ProgressSeries } from "@/types/dashboard/client-records";

type ProgressSeriesCardProps = {
  series: ProgressSeries;
};

const strokeColorMap: Record<string, string> = {
  "bg-primary": "#5750F1",
  "bg-orange-400": "#fb923c",
  "bg-green": "#22c55e",
  "bg-yellow-400": "#facc15",
};

export function ProgressSeriesCard({ series }: ProgressSeriesCardProps) {
  const values = series.points.map((point) => point.value);
  const secondaryValues = series.points.map((point) => point.secondaryValue ?? 0);
  const max = Math.max(
    ...values.map((value, index) => value + (series.chartType === "stacked" ? secondaryValues[index] : 0)),
  );
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const chartHeight = 190;

  if (series.chartType === "line") {
    const points = series.points
      .map((point, index) => {
        const x = (index / Math.max(series.points.length - 1, 1)) * 100;
        const y = 100 - ((point.value - min) / range) * 78 - 8;
        return `${x},${y}`;
      })
      .join(" ");

    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              {series.title}
            </h3>
            <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">{series.subtitle}</p>
          </div>
          <span className="rounded-[10px] bg-dark-2 px-3 py-1.5 text-xs text-dark-5 dark:bg-dark-3">
            All Time
          </span>
        </div>

        <div className="relative h-[240px]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[190px] w-full">
            <defs>
              <linearGradient id={`${series.id}-gradient`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              points={areaPoints}
              className="text-current"
              fill={`url(#${series.id}-gradient)`}
              style={{ color: strokeColorMap[series.accent] ?? "#5750F1" }}
            />
            <polyline
              points={points}
              className="fill-none stroke-[2.5]"
              style={{ stroke: strokeColorMap[series.accent] ?? "#5750F1" }}
            />
            {series.points.map((point, index) => {
              const x = (index / Math.max(series.points.length - 1, 1)) * 100;
              const y = 100 - ((point.value - min) / range) * 78 - 8;
              return (
                <circle
                  key={point.label}
                  cx={x}
                  cy={y}
                  r="1.4"
                  style={{ fill: strokeColorMap[series.accent] ?? "#5750F1" }}
                />
              );
            })}
          </svg>

          <div className="mt-2 grid grid-cols-8 gap-2 text-center text-xs text-dark-5">
            {series.points.map((point) => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const barMax = 80;

  return (
    <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {series.title}
          </h3>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">{series.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-[10px] bg-dark-2 px-3 py-1.5 text-xs text-dark-5 dark:bg-dark-3">
            All Time
          </span>
          <div className="flex items-center gap-3 text-xs text-dark-5">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Fat
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green" />
              Lean
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-[200px] items-end justify-between gap-1">
        {series.points.map((point) => {
          const fat = point.secondaryValue ?? 0;
          const lean = point.value;
          const total = fat + lean;
          const barHeight = 160;
          const totalHeight = Math.min((total / barMax) * barHeight, barHeight);
          const fatHeight = total > 0 ? (fat / total) * totalHeight : 0;
          const leanHeight = total > 0 ? (lean / total) * totalHeight : 0;

          return (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="flex w-full max-w-[36px] flex-col-reverse overflow-hidden rounded-t-[6px] bg-dark-2/30"
                style={{ height: totalHeight }}
              >
                <div
                  className="w-full bg-orange-400/90"
                  style={{ height: Math.max(fatHeight, 2) }}
                />
                <div
                  className="w-full bg-green/90"
                  style={{ height: Math.max(leanHeight, 2) }}
                />
              </div>
              <div className="text-[11px] text-dark-5">{point.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
