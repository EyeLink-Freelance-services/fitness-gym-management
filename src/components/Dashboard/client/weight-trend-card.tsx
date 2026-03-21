"use client";

import type { ClientWeightTrendPoint } from "@/types/dashboard/client";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  data: ClientWeightTrendPoint[];
};

export function WeightTrendCard({ data }: Props) {
  const values = data.flatMap((point) => [point.weight, point.target]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const categories = data.map((point) => point.label);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 320,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#8155FF", "#64748B"],
    stroke: {
      curve: "smooth",
      width: [3, 2],
      dashArray: [0, 6],
    },
    dataLabels: {
      enabled: false,
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
    fill: {
      type: ["gradient", "solid"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.18,
        opacityTo: 0.04,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories,
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
      min: Math.floor((minValue - 1) * 2) / 2,
      max: Math.ceil((maxValue + 1) * 2) / 2,
      tickAmount: 6,
      labels: {
        formatter: (value) => `${value.toFixed(0)}kg`,
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(1)} kg`,
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Weight Trend
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
            Weekly progress against your current weight-loss target.
          </p>
        </div>

        <select
          defaultValue="last-8-weeks"
          className="h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
        >
          <option value="last-8-weeks">Last 8 Weeks</option>
        </select>
      </div>

      <div className="-ml-4 -mr-4 h-[320px]">
        <Chart
          type="area"
          height={320}
          options={options}
          series={[
            {
              name: "Weight",
              data: data.map((point) => point.weight),
            },
            {
              name: "Target",
              data: data.map((point) => point.target),
            },
          ]}
        />
      </div>
    </div>
  );
}
