import { ArrowDownIcon, ArrowUpIcon } from "@/components/IconsCollection/icons";
import { cn } from "@/lib/utils";
import { OverviewCardProps } from "@/types/dashboard/dashboard-shared";

export function OverviewCard({ label, data, Icon }: OverviewCardProps) {
  const hasArrow = data.arrow !== undefined;
  const hasGrowthRate = data.growthRate !== undefined;
  const showIndicator = hasArrow || hasGrowthRate;

  const isDecreasing =
    hasArrow && data.arrow === "down"
      ? true
      : hasGrowthRate && data.growthRate! < 0;

  return (
    <div className="rounded-2xl border-0 bg-gray-50 p-5 shadow-1 dark:border dark:border-gray-7/50 dark:bg-gray-dark">
      <div className="flex items-center justify-between">
        <ul>
          <li className="text-sm font-medium text-dark-6">{label}</li>
          <li className="text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </li>
        </ul>

        {Icon && <Icon width={40} height={40} />}

        {showIndicator && (
          <div
            className={cn("font-bold", isDecreasing ? "text-red" : "text-green")}
          >
            <p className="flex items-center gap-1.5">
              {hasGrowthRate && `${data.growthRate}%`}
              {isDecreasing ? (
                <ArrowDownIcon aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <ArrowUpIcon aria-hidden className="h-3.5 w-3.5" />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
