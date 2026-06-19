import { cn } from "@/lib/utils";
import { PaymentsOverviewChart } from "../payments-overview/chart";
import { getTotalSalesData } from "@/services/charts.services";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function WeeksProfit({ className }: PropsType) {
  const data = await getTotalSalesData();

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
        Total Sales
      </h2>

      <PaymentsOverviewChart data={data} />
    </div>
  );
}
