import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";
import type {
  MembershipPlanAccent,
  MembershipPlanCardProps,
} from "@/types/dashboard/membership";

const accentStyles: Record<
  MembershipPlanAccent,
  {
    badge: string;
    price: string;
    border: string;
  }
> = {
  sky: {
    badge: "bg-[#06B6D4]/10 text-[#0891B2] dark:bg-[#06B6D4]/15 dark:text-[#67E8F9]",
    price: "text-[#06B6D4] dark:text-[#67E8F9]",
    border: "border-[#06B6D4]/20",
  },
  amber: {
    badge: "bg-[#F59E0B]/10 text-[#D97706] dark:bg-[#F59E0B]/15 dark:text-[#FCD34D]",
    price: "text-[#F59E0B] dark:text-[#FCD34D]",
    border: "border-[#F59E0B]/20",
  },
  primary: {
    badge: "bg-primary/10 text-primary dark:bg-primary/15 dark:text-[#A5B4FC]",
    price: "text-primary dark:text-[#A5B4FC]",
    border: "border-primary/25",
  },
  violet: {
    badge: "bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/15 dark:text-[#C4B5FD]",
    price: "text-[#7C3AED] dark:text-[#C4B5FD]",
    border: "border-[#7C3AED]/20",
  },
  green: {
    badge: "bg-green/10 text-green dark:bg-green/15 dark:text-[#86EFAC]",
    price: "text-green dark:text-[#86EFAC]",
    border: "border-green/20",
  },
};

function FeatureStateIcon({ included }: { included: boolean }) {
  return included ? (
    <span className="inline-flex size-5 items-center justify-center rounded-full bg-green/10 text-green dark:bg-green/15">
      <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden>
        <path d="M6.41 11.2L2.97 7.76l1.06-1.06 2.38 2.38 5.56-5.56 1.06 1.06-6.62 6.62z" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex size-5 items-center justify-center rounded-full bg-red/10 text-red dark:bg-red/15">
      <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden>
        <path d="M4.53 3.47L8 6.94l3.47-3.47 1.06 1.06L9.06 8l3.47 3.47-1.06 1.06L8 9.06l-3.47 3.47-1.06-1.06L6.94 8 3.47 4.53l1.06-1.06z" />
      </svg>
    </span>
  );
}

export function MembershipPlanCard({ plan }: MembershipPlanCardProps) {
  const accent = accentStyles[plan.accent];

  return (
    <article
      className={cn(
        "rounded-[18px] border bg-white p-6 shadow-1 transition-transform hover:-translate-y-0.5 dark:bg-gray-dark dark:shadow-card",
        plan.isFeatured ? accent.border : "border-stroke dark:border-dark-3",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            accent.badge,
          )}
        >
          {plan.category}
        </span>

        {plan.isFeatured && (
          <span className="text-xs font-medium text-primary dark:text-[#A5B4FC]">
            Most popular
          </span>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-[30px] font-bold tracking-tight text-dark dark:text-white">
          {plan.name}
        </h3>

        <div className="mt-3 flex items-end gap-2">
          <span
            className={cn(
              "text-[40px] font-bold leading-none tracking-tight",
              accent.price,
            )}
          >
            {plan.price}
          </span>
          <span className="pb-1 text-sm text-dark-6 dark:text-dark-6">
            {plan.billingLabel}
          </span>
        </div>

        <span
          className={cn(
            "mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium",
            accent.badge,
          )}
        >
          {plan.durationLabel}
        </span>
      </div>

      <ul className="mt-6 space-y-3 border-t border-stroke pt-6 dark:border-dark-3">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className="flex items-center gap-3 text-sm text-dark dark:text-white"
          >
            <FeatureStateIcon included={feature.included} />
            <span className={cn(!feature.included && "text-dark-6 dark:text-dark-6")}>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-[12px] bg-gray-1 px-4 py-3 dark:bg-dark-2">
          <p className="text-[28px] font-bold leading-none text-dark dark:text-white">
            {plan.members}
          </p>
          <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">Members</p>
        </div>

        <div className="rounded-[12px] bg-gray-1 px-4 py-3 dark:bg-dark-2">
          <p className="text-[28px] font-bold leading-none text-dark dark:text-white">
            {plan.revenue}
          </p>
          <p className="mt-2 text-xs text-dark-6 dark:text-dark-6">This month</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          label="Edit"
          size="small"
          variant="outlineDark"
          className="flex-1"
          toastMessage={plan.editToast}
        />
        <Button
          label={plan.secondaryActionLabel}
          size="small"
          variant={plan.secondaryActionVariant}
          className="flex-1"
          toastMessage={plan.secondaryActionToast}
        />
      </div>
    </article>
  );
}
