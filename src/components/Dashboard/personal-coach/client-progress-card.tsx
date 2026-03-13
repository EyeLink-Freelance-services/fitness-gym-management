import { ClientProgressChart } from "@/components/Dashboard/personal-coach/client-progress-chart";
import type { PersonalCoachProgressSeries } from "@/types/dashboard/personal-coach";

type Props = {
  data: PersonalCoachProgressSeries[];
};

export function ClientProgressCard({ data }: Props) {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Client Progress
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
            Track individual client performance over time.
          </p>
        </div>

        <select
          defaultValue="all"
          className="h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
        >
          <option value="all">All Clients</option>
          {data.map((series) => (
            <option key={series.id} value={series.id}>
              {series.clientName}
            </option>
          ))}
        </select>
      </div>

      <ClientProgressChart data={data} />
    </div>
  );
}
