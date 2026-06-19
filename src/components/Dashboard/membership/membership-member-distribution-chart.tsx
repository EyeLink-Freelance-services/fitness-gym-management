"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { MembershipMemberDistributionChartProps } from "@/types/dashboard/membership";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function MembershipMemberDistributionChart({
  data,
}: MembershipMemberDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 320,
      fontFamily: "inherit",
    },
    labels: data.map((item) => item.label),
    colors: data.map((item) => item.color),
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 18,
              color: "#64748B",
            },
            value: {
              show: true,
              offsetY: -12,
              fontSize: "28px",
              fontWeight: "700",
              color: "#1C2434",
              formatter: () => String(total),
            },
            total: {
              show: true,
              label: "Members",
              color: "#64748B",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} members`,
      },
    },
  };

  return (
    <div>
      <div className="mx-auto max-w-[320px]">
        <Chart
          type="donut"
          height={320}
          options={options}
          series={data.map((item) => item.value)}
        />
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item) => {
          const share = total === 0 ? 0 : Math.round((item.value / total) * 100);

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2 text-dark dark:text-white">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span>{item.label}</span>
              </div>

              <span className="text-dark-6 dark:text-dark-6">
                {item.value} ({share}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
