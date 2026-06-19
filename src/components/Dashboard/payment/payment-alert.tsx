import { Button } from "@/components/ui-elements/button";
import type { PaymentAlertProps } from "@/types/dashboard/payment";

export function PaymentAlert({ alert }: PaymentAlertProps) {
  return (
    <section className="mb-8 rounded-[10px] border border-red/20 bg-red/5 px-6 py-4 shadow-1 dark:border-red/20 dark:bg-red/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-red">{alert.title}</p>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {alert.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            label={alert.primaryActionLabel}
            size="small"
            variant="outlinePrimary"
            toastMessage="Bulk reminder flow is not connected yet."
          />
          <Button
            label={alert.secondaryActionLabel}
            size="small"
            variant="outlineDark"
            toastMessage="Overdue list is not connected yet."
          />
        </div>
      </div>
    </section>
  );
}
