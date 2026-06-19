"use client";

import type { PaymentCollectionsChartProps } from "@/types/dashboard/payment";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function PaymentCollectionsChart({
  data,
}: PaymentCollectionsChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 360,
      stacked: false,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "58%",
        borderRadius: 6,
      },
    },
    colors: ["#5750F1", "#D7DDF2", "#F59E9E"],
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
      categories: data.map((item) => item.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 35,
      tickAmount: 7,
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
            name: "Collected",
            data: data.map((item) => item.collected),
          },
          {
            name: "Expected",
            data: data.map((item) => item.expected),
          },
          {
            name: "Overdue",
            data: data.map((item) => item.overdue),
          },
        ]}
      />
    </div>
  );
}
