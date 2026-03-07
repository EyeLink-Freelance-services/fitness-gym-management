import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui-elements/button";
import { DashboardSectionProps } from "@/types/dashboard";

export function DashboardSection({
  title,
  className,
  buttonLabel,
  buttonPath,
  buttonToast,
  children,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "mb-8 rounded-[10px] bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          {title}
        </h2>

        {buttonLabel && buttonPath && (
          <Link href={buttonPath}>
            <Button label={buttonLabel} toastMessage={buttonToast} />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
