"use client";

import type { ClientBodyCompositionPoint } from "@/types/dashboard/client";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  data: ClientBodyCompositionPoint[];
};

export function BodyCompositionCard({ data }: Props) {
  const values = data.flatMap((point) => [point.bodyFat, point.muscleMass]);
  const maxValue = Math.max(...values);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#F59E0B", "#8155FF"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "48%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "13px",
      labels: {
        colors: "#64748B",
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: data.map((point) => point.label),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: Math.ceil((maxValue + 4) / 5) * 5,
      tickAmount: 6,
      labels: {
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value, { seriesIndex }) =>
          seriesIndex === 0 ? `${value.toFixed(1)}%` : `${value.toFixed(1)} kg`,
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Body Composition
        </h2>
        <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
          Follow how body fat and muscle mass change over time.
        </p>
      </div>

      <div className="-ml-3 -mr-3 h-[320px]">
        <Chart
          type="bar"
          height={320}
          options={options}
          series={[
            {
              name: "Fat %",
              data: data.map((point) => point.bodyFat),
            },
            {
              name: "Muscle kg",
              data: data.map((point) => point.muscleMass),
            },
          ]}
        />
      </div>
    </div>
  );
}
