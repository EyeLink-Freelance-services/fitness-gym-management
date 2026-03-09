"use client";
 
import { useEffect, useState } from "react";
import { listMembershipPlanActiveAction } from "../actions";
import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import { getDurationLabel } from "@/utils/transform-days-label";
import { formatCurrency } from "@/lib/formatters/format-number";

type Props = {
  selectedPlan?: any | null;
  setSelectedPlan?: React.Dispatch<React.SetStateAction<any | null>>;
};
 
export default function MembershipPlansSelector({selectedPlan, setSelectedPlan}: Props) {
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanRow[]>();

  useEffect(() => {
    const getMembershipPlansAvailable = async () => {
      const list = await listMembershipPlanActiveAction();
      setMembershipPlans(list.data);
    }

    getMembershipPlansAvailable();
  }, [])
 
  const selected = membershipPlans?.find((plan) => plan.id === selectedPlan?.id);
 
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="panel-title">
            Membership Plan
          </h2>
          <p className="panel-sub">
            Select the plan that best fits your fitness journey.
          </p>
        </div>
 
        <div
          className={`grid gap-6
          ${membershipPlans && membershipPlans?.length <= 2 ? "justify-center md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}
          grid-cols-1`}
        >
          {membershipPlans?.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
 
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan?.(plan)}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none ${
                  isSelected
                    ? "border-primary dark:bg-primary ring-2 ring-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* {plan.popular && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#F28227] px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    )} */}
    
                    <div className={`mb-4 ${isSelected && "dark:text-white [&_*]:dark:text-white"}`}>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </p>
                      {
                        plan.entree_fee &&
                        <p className="mb-3 text-sm text-red-500">
                          Entree fee: {plan.entree_fee && formatCurrency(plan.entree_fee)}
                        </p>
                      }
                      <p className="mt-1 text-sm text-gray-500">{getDurationLabel(plan)}</p>
                      {plan.description && (
                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {plan.description}
                        </p>
                      )}
                    </div>
    
                    <ul className={`space-y-3 ${isSelected && "dark:text-white [&_*]:dark:text-white"}`}>
                      {plan.features?.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1 h-2 w-2 rounded-full dark:bg-gray' bg-black" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
 
                <div className="mt-6">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      isSelected
                        ? "bg-primary dark:bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selected && 
          (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selected Plan</p>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selected?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Rs {selected?.price.toLocaleString()} • {selected && getDurationLabel(selected)}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan?.(null)}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>
          )
        }
 
      </div>
    </div>
  );
}

 