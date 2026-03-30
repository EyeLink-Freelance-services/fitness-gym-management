"use client";

import { SkeletonUI } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters/format-number";
import {
  MembershipPlanEditInput,
  MembershipPlanRow,
} from "@/lib/validation/schemas/membership-plan";
import { getDurationLabel } from "@/utils/transform-days-label";
import { useMemo, useState } from "react";

type Props = {
  loading: boolean;
  plans: MembershipPlanRow[] | undefined;
  onCreate?: () => void;
  onView?: (plan: MembershipPlanRow) => void;
  onEdit?: (plan: MembershipPlanRow) => void;
  onToggleActive?: (plan: MembershipPlanEditInput) => void;
};

export default function MembershipPlansList({
  loading,
  plans,
  onCreate,
  onView,
  onEdit,
  onToggleActive,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const filteredPlans = useMemo(() => {
    return plans?.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(search.toLowerCase()) ||
        (plan.description ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ? true : status === "active" ? plan.is_active : !plan.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [plans, search, status]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Membership Plans
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage pricing, duration, entry fee, and plan availability.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90 dark:hover:bg-white/80 dark:hover:text-black"
        >
          + New Plan
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "all" | "active" | "inactive")
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-500"
          >
            <option value="all">All status</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
              <tr className="text-sm text-gray-600 dark:text-gray-300">
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Entry Fee</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Billing Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans?.length === 0 ? (
                loading ? (
                  <tr>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <td
                        key={index}
                        colSpan={1}
                        className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        <SkeletonUI className="h-5" />
                      </td>
                    ))}
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No membership plan found.
                    </td>
                  </tr>
                )
              ) : (
                filteredPlans?.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-gray-100 last:border-b-0 dark:border-gray-800"
                  >
                    <td className="px-4 py-4 align-top">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {plan.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {plan.description || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatCurrency(plan.price)}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {plan.entree_fee ? formatCurrency(plan.entree_fee) : "-"}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {getDurationLabel(plan)}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {plan.is_monthly ? "Monthly" : "Custom"}
                    </td>

                    <td className="px-4 py-4">
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
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView?.(plan)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit?.(plan)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onToggleActive?.({
                              ...plan,
                              features: plan.features?.map((feature) => ({
                                value: feature,
                              })),
                              is_active: !plan.is_active,
                            })
                          }
                          className={[
                            "rounded-lg px-3 py-1.5 text-sm transition",
                            plan.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                              : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30",
                          ].join(" ")}
                        >
                          {plan.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 md:hidden">
          {!filteredPlans && <SkeletonUI className="h-10 w-5" />}

          {filteredPlans?.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No membership plans found.
            </div>
          ) : (
            filteredPlans?.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {plan.description || "-"}
                    </p>
                  </div>

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

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Price</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(plan.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Entry Fee</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {plan.entree_fee ? formatCurrency(plan.entree_fee) : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {getDurationLabel(plan)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Billing Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {plan.is_monthly ? "Monthly" : "Custom"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(plan)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit?.(plan)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onToggleActive?.({
                        ...plan,
                        features: plan.features?.map((feature) => ({
                          value: feature,
                        })),
                        is_active: !plan.is_active,
                      })
                    }
                    className={[
                      "rounded-lg px-3 py-2 text-sm transition",
                      plan.is_active
                        ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30",
                    ].join(" ")}
                  >
                    {plan.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}