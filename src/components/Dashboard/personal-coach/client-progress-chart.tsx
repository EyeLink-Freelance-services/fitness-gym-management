"use client";

import type { PersonalCoachProgressSeries } from "@/types/dashboard/personal-coach";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  data: PersonalCoachProgressSeries[];
};

export function ClientProgressChart({ data }: Props) {
  const categories = data[0]?.points.map((point) => point.label) ?? [];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 360,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: data.map((series) => series.color),
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: {
        colors: "#64748B",
      },
      markers: {
        size: 6,
      },
    },
    fill: {
      type: "gradient",
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
      min: 0,
      max: 100,
      tickAmount: 10,
      labels: {
        formatter: (value) => `${value.toFixed(0)}%`,
        style: {
          colors: "#94A3B8",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value.toFixed(0)}%`,
      },
    },
  };

  return (
    <div className="-ml-4 -mr-4 h-[360px]">
      <Chart
        type="area"
        height={360}
        options={options}
        series={data.map((series) => ({
          name: series.clientName,
          data: series.points.map((point) => point.value),
        }))}
      />
    </div>
  );
}
