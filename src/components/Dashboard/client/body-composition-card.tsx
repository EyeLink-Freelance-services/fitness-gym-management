"use client";

import type { ClientBodyCompositionPoint } from "@/types/dashboard/client";
import { BarChart } from "@/components/Dashboard/charts/bar-chart";

type Props = {
  data: ClientBodyCompositionPoint[];
};

export function BodyCompositionCard({ data }: Props) {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Body Composition
        </h2>
        <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
          Follow how body fat and muscle mass change over time.
        </p>
      </div>

      <BarChart
        labels={data.map((p) => p.label)}
        series={[
          { name: "Fat %", data: data.map((p) => p.bodyFat), color: "#F59E0B" },
          {
            name: "Muscle kg",
            data: data.map((p) => p.muscleMass),
            color: "#8155FF",
          },
        ]}
        stacked={false}
        height={320}
        tooltipUnits={["%", "kg"]}
      />
    </div>
  );
}
