import { Button } from "@/components/ui-elements/button";
import type { MembershipPlanCatalogProps } from "@/types/dashboard/membership";
import { MembershipPlanCard } from "./membership-plan-card";

export function MembershipPlanCatalog({ plans }: MembershipPlanCatalogProps) {
  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Plan Catalog
          </h2>
          <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
            Configure pricing, features and access levels for each plan.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            label="Manage Promos"
            size="small"
            variant="outlineDark"
            toastMessage="Promo management is not connected yet."
          />
          <Button
            label="+ New Plan"
            size="small"
            toastMessage="Plan creation is not connected yet."
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {plans.map((plan) => (
          <MembershipPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
