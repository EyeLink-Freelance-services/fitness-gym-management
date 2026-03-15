"use client";

import type { PersonalCoachProgressSeries } from "@/types/dashboard/personal-coach";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const DEFAULT_COLOR = "#5750F1";

type Props = {
  data: PersonalCoachProgressSeries[];
  height?: number;
  unit?: string;
  showLegend?: boolean;
};

export function ClientProgressChart({
  data,
  height = 360,
  unit = "%",
  showLegend,
}: Props) {
  const categories = data[0]?.points.map((point) => point.label) ?? [];
  const allValues = data.flatMap((s) => s.points.map((p) => p.value));
  const dataMin = Math.min(...allValues, 0);
  const dataMax = Math.max(...allValues);

  const isPercent = unit === "%";
  const yMin = isPercent ? 0 : Math.floor(dataMin - (dataMax - dataMin) * 0.1);
  const yMax = isPercent ? 100 : Math.ceil(dataMax + (dataMax - dataMin) * 0.1);

  const formatValue = (value: number) => {
    if (unit === "%") return `${value.toFixed(0)}%`;
    if (unit === "kg") return value.toFixed(1);
    return value.toFixed(0);
  };

  const options: ApexOptions = {
    chart: {
      type: "area",
      height,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: data.map((series) => series.color ?? DEFAULT_COLOR),
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    legend: {
      show: showLegend ?? data.length > 1,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: { colors: "#64748B" },
      markers: { size: 6 },
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
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
      },
    },
    yaxis: {
      min: yMin,
      max: yMax,
      tickAmount: 5,
      labels: {
        formatter: (value) => formatValue(value),
        style: { colors: "#94A3B8", fontSize: "12px" },
      },
    },
    tooltip: {
      y: { formatter: (value) => formatValue(Number(value)) },
    },
  };

  return (
    <div className="-ml-4 -mr-4" style={{ height }}>
      <Chart
        type="area"
        height={height}
        options={options}
        series={data.map((series) => ({
          name: series.clientName,
          data: series.points.map((point) => point.value),
        }))}
      />
    </div>
  );
}
