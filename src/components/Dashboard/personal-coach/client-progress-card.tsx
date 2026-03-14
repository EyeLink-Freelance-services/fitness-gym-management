import { ClientProgressChart } from "@/components/Dashboard/personal-coach/client-progress-chart";
import type { PersonalCoachProgressProps } from "@/types/dashboard/personal-coach";
import CardTitle from "../overview-cards/cardTitle";
import CustomSelect from "@/components/ui/custom-select";

export function ClientProgressCard({ data }: PersonalCoachProgressProps) {
  const options = [
    { label: "All Clients", value: "all" },
    ...data.map((series) => ({
      label: series.clientName,
      value: series.id,
    })),
  ];

  return (
    <div className="rounded-xl bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle
            title="Client Progress"
            subtitle=" Track individual client performance over time."
          />
        </div>

        <CustomSelect options={options} />
      </div>

      <ClientProgressChart data={data} />
    </div>
  );
}
