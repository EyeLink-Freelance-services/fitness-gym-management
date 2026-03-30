import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import Link from "next/link";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getDurationLabel(plan: MembershipPlanRow) {
  if (plan.is_monthly) {
    const months = plan.duration_days / 30;
    if (months === 1) return "1 month";
    if (Number.isInteger(months)) return `${months} months`;
  }

  if (plan.duration_days === 1) return "1 day";
  return `${plan.duration_days} days`;
}

interface MembershipPlanProps {
  plan: MembershipPlanRow;
}

export default function MembershipPlanView({ plan }: MembershipPlanProps) {
  if (!plan) {
    return (
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Membership plan not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {plan.name}
              </h1>
              <span
                className={[
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  plan.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                ].join(" ")}
              >
                {plan.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              View the configured pricing, duration, and details for this membership
              plan.
            </p>
          </div>

          <Link
            href={`/membership-plans/${plan.id}/edit`}
            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Edit Plan
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(plan.price)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Entry Fee</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {plan.entree_fee ? formatCurrency(plan.entree_fee) : "-"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Billing Type</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {plan.is_monthly ? "Monthly" : "Custom"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getDurationLabel(plan)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
          <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
            {plan.description || "-"}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Features</p>

          {!plan.features || plan.features.length === 0 ? (
            <span className="text-sm font-light text-gray-500 dark:text-gray-400">
              No features available
            </span>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-800 dark:text-gray-200">
              {plan.features.map((f, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-black dark:bg-gray-200" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(plan.created_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(plan.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}