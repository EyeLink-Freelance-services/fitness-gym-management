import { Button } from "@/components/ui-elements/button";
import type { PaymentQuickActionsProps } from "@/types/dashboard/payment";

export function PaymentQuickActions({ actions }: PaymentQuickActionsProps) {
  return (
    <section className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
          Common finance tasks for the front desk and admin team.
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.label}
            className="rounded-[10px] border border-stroke p-4 dark:border-dark-3"
          >
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-dark dark:text-white">
                  {action.label}
                </p>
                <p className="mt-1 text-sm text-dark-6 dark:text-dark-6">
                  {action.description}
                </p>
              </div>

              <div>
                <Button
                  label={action.label}
                  size="small"
                  variant={action.variant}
                  toastMessage={action.toastMessage}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
