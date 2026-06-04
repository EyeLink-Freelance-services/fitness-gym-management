import { cn } from "@/lib/utils";

export function ProfileSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-white px-6 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h3 className="mb-5 border-b border-stroke pb-4 text-xs font-semibold uppercase tracking-wide text-dark dark:border-dark-3 dark:text-white">
        {title}
      </h3>
      {children}
    </section>
  );
}
