import { cn } from "@/lib/utils";
import type { StatusBadgeProps, StatusTone } from "@/types/shared";

const toneClasses: Record<StatusTone, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary",
  success: "bg-green/10 text-green dark:bg-green/15 dark:text-green",
  warning: "bg-[#FFA70B]/10 text-[#FFA70B] dark:bg-[#FFA70B]/15 dark:text-[#FFBF47]",
  danger: "bg-red/10 text-red dark:bg-red/15 dark:text-red",
  neutral: "bg-dark-2 text-dark-6 dark:bg-dark-3 dark:text-dark-6",
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}
