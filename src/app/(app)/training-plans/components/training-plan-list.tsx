"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/FormElements/common/header";
import { Select } from "@/components/FormElements/select";
import { ROUTES } from "@/constants/route";
import { TrainingPlan, TrainingPlanStatus } from "@/types/training-plan";
import TrainingPlanCard from "./training-plan-card";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";

type Props = {
  plans?: TrainingPlan[];
};

const statusItems: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function TrainingPlansList({ plans }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TrainingPlanStatus>("all");

  const filteredPlans = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return plans?.filter((plan) => {
      const matchesSearch =
        !normalizedSearch ||
        plan.title.toLowerCase().includes(normalizedSearch) ||
        (plan.description ?? "").toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === "all" || plan.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [plans, search, status]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Header
          label="- Overview"
          title="Training Plans"
          subtitle="Manage workout programs"
        />

        <Button
          onClick={() => router.push(ROUTES.TRAINING_PLANS.NEW_TEMPLATES)}
          label="Create Training Plan"
        />
       
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <InputGroup
          label="Search"
          type="text"
          placeholder="Search by title or description"
          value={search}
          handleChange={(e) => setSearch(e.target.value)}
        />

        <Select
          label="Status"
          placeholder="Filter by status"
          items={statusItems}
          defaultValue={status}
          selectProps={{
            value: status,
            onChange: (e) =>
              setStatus(e.target.value as "all" | TrainingPlanStatus),
          }}
        />
      </div>

      <div className="mb-4 text-sm text-dark-5 dark:text-dark-6">
        {filteredPlans?.length} {filteredPlans?.length === 1 ? "plan" : "plans"} found
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlans?.map((plan) => (
          <TrainingPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredPlans?.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-stroke bg-white px-6 py-10 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-sm text-dark-5 dark:text-dark-6">
            No training plans found.
          </p>
        </div>
      )}
    </div>
  );
}