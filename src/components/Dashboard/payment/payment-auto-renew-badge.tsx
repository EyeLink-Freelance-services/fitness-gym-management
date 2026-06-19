import { cn } from "@/lib/utils";
import type { PaymentAutoRenewBadgeProps } from "@/types/dashboard/payment";

export function PaymentAutoRenewBadge({
  enabled,
}: PaymentAutoRenewBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        enabled
          ? "bg-primary/10 text-primary"
          : "bg-dark-2 text-dark-6 dark:bg-dark-3 dark:text-dark-6",
      )}
    >
      {enabled ? "Enabled" : "Off"}
    </span>
  );
}
