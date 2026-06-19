"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { MembershipPlanRevenueChartProps } from "@/types/dashboard/membership";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const barColors = ["#06B6D4", "#94A3B8", "#2563EB", "#7C3AED", "#16A34A"];

export function MembershipPlanRevenueChart({
  data,
}: MembershipPlanRevenueChartProps) {
  const values = data.map((item) => item.revenue);
  const maxValue = Math.max(...values, 0);
  const yAxisMax = Math.max(Math.ceil(maxValue / 5) * 5, 10);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 360,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 8,
        columnWidth: "54%",
      },
    },
    colors: barColors,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: data.map((item) => item.label),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: yAxisMax,
      tickAmount: Math.min(yAxisMax / 5, 6),
      labels: {
        formatter: (value) => `Rs ${value}K`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `Rs ${value.toFixed(1)}K`,
      },
    },
  };

  return (
    <div className="-ml-3 -mr-3 h-[360px]">
      <Chart
        type="bar"
        height={360}
        options={options}
        series={[
          {
            name: "Revenue",
            data: values,
          },
        ]}
      />
    </div>
  );
}
