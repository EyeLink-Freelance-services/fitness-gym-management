import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui-elements/button";
import { DashboardSectionProps } from "@/types/dashboard/dashboard-shared";
import CardTitle from "./overview-cards/cardTitle";

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
        "mb-8 rounded-xl bg-white px-7.5 py-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <CardTitle title={title} />

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
