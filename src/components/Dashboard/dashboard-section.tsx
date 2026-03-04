import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export function DashboardSection({
  title,
  className,
  children,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "mb-8 rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}
