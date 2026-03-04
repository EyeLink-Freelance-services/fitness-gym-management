import { cn } from "@/lib/utils";

type ChartPlaceholderProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export function ChartPlaceholder({
  title,
  className,
  children,
}: ChartPlaceholderProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        {title}
      </h2>
      {children ?? (
        <div className="bg-dark-1/30 flex h-[240px] items-center justify-center rounded-lg border border-dashed border-dark-3 dark:border-dark-3 dark:bg-dark-2/30">
          <span className="text-sm text-dark-6">Chart area</span>
        </div>
      )}
    </div>
  );
}
