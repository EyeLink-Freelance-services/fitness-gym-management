"use client";
 
import { useState } from "react";
 
type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  sessions?: string;
  features: string[];
  popular?: boolean;
};
 
const membershipPlans: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 1500,
    duration: "1 Month",
    sessions: "8 sessions",
    features: [
      "Gym access",
      "Basic workout guidance",
      "1 body assessment",
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: 2500,
    duration: "1 Month",
    sessions: "12 sessions",
    popular: true,
    features: [
      "Gym access",
      "Personalized training plan",
      "Nutrition guidance",
      "2 body assessments",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 4000,
    duration: "1 Month",
    sessions: "Unlimited sessions",
    features: [
      "Full gym access",
      "Personal coach follow-up",
      "Diet plan included",
      "Weekly progress tracking",
    ],
  },
];
 
export default function MembershipPlansSelector() {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");
 
  const selected = membershipPlans.find((plan) => plan.id === selectedPlan);
 
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="panel-title">
            Choose Your Membership Plan
          </h2>
          <p className="panel-sub">
            Select the plan that best fits your fitness journey.
          </p>
        </div>
 
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {membershipPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
 
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none ${
                  isSelected
                    ? "border-[#5726AD] dark:bg-[#5726AD] ring-2 ring-[#5726AD]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#F28227] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
 
                <div className={`mb-4 ${isSelected && "dark:text-white [&_*]:dark:text-white"}`}>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    Rs {plan.price.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{plan.duration}</p>
                  {plan.sessions && (
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {plan.sessions}
                    </p>
                  )}
                </div>
 
                <ul className={`space-y-3 ${isSelected && "dark:text-white [&_*]:dark:text-white"}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1 h-2 w-2 rounded-full dark:bg-gray' bg-black" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
 
                <div className="mt-6">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      isSelected
                        ? "bg-[#5726AD] dark:bg-black text-white"
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
 
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Selected Plan</p>
              <h4 className="text-lg font-semibold text-gray-900">
                {selected?.name}
              </h4>
              <p className="text-sm text-gray-600">
                Rs {selected?.price.toLocaleString()} • {selected?.duration}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 