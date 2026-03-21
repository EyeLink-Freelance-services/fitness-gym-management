"use client";

import { ClientProgressChart } from "@/components/Dashboard/personal-coach/client-progress-chart";
import type { PersonalCoachProgressProps } from "@/types/dashboard/personal-coach";
import type { ClientProgressSeries } from "@/types/dashboard/client-records";
import { useMemo, useState } from "react";
import CardTitle from "../overview-cards/cardTitle";
import CustomSelect from "@/components/ui/custom-select";

export function ClientProgressCard({ data }: PersonalCoachProgressProps) {
  const [selectedId, setSelectedId] = useState<string>("all");

  const options = useMemo(
    () => [
      { label: "All Clients", value: "all" },
      ...data.map((series) => ({
        label: series.clientName,
        value: series.id,
      })),
    ],
    [data],
  );

  const filteredData = useMemo((): ClientProgressSeries[] => {
    if (selectedId === "all") return data;
    const found = data.find((s) => s.id === selectedId);
    return found ? [found] : [];
  }, [data, selectedId]);

  const hasData =
    filteredData.length > 0 && filteredData.some((s) => s.points?.length > 0);

  return (
    <div className="rounded-xl bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <CardTitle
          title="Client Progress"
          subtitle="Track individual client performance over time."
        />

        <div className="w-40">
          <CustomSelect
            options={options}
            defaultValue="all"
            onChange={(value) => setSelectedId(value)}
            placeholder="All Clients"
          />
        </div>
      </div>

      {hasData ? (
        <ClientProgressChart data={filteredData} />
      ) : (
        <div className="flex h-[360px] items-center justify-center rounded-lg border border-dashed border-stroke text-dark-5 dark:border-dark-3 dark:text-dark-6">
          {data.length === 0
            ? "No progress data yet. Clients will appear here once they log entries."
            : "No progress data for selected client."}
        </div>
      )}
    </div>
  );
}
