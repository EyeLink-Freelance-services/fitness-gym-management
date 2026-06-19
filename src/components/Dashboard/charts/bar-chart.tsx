"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export type BarChartSeries = {
  name: string;
  data: number[];
  color?: string;
};

type Props = {
  labels: string[];
  series: BarChartSeries[];
  stacked?: boolean;
  height?: number;
  className?: string;
  tooltipUnits?: (string | undefined)[];
};

export function BarChart({
  labels,
  series,
  stacked = false,
  height = 320,
  className = "",
  tooltipUnits,
}: Props) {
  const allValues = series.flatMap((s) => s.data);
  const maxValue = Math.max(...allValues, 0);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height,
      stacked,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: series.map((s) => s.color ?? "#64748B"),
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: stacked ? "60%" : "48%",
        horizontal: false,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: stacked ? "right" : "left",
      fontSize: "13px",
      labels: { colors: "#64748B" },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
      },
    },
    yaxis: {
      min: 0,
      max: stacked ? undefined : Math.ceil((maxValue + 4) / 5) * 5,
      tickAmount: stacked ? 5 : 6,
      labels: {
        formatter: stacked ? (v) => `${v}` : undefined,
        style: { colors: "#94A3B8", fontSize: "12px" },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: tooltipUnits?.length
        ? {
            formatter: (v, { seriesIndex }) => {
              const val = Number(v);
              const unit = tooltipUnits[seriesIndex];
              return unit ? `${val.toFixed(1)} ${unit}` : val.toFixed(1);
            },
          }
        : undefined,
    },
  };

  return (
    <div className={className} style={{ minHeight: height }}>
      <Chart
        type="bar"
        height={height}
        options={options}
        series={series.map((s) => ({ name: s.name, data: s.data }))}
      />
    </div>
  );
}
