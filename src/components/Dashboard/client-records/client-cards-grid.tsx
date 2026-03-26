"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { cn } from "@/lib/utils";
import type { ClientCardsGridProps } from "@/types/dashboard/client-records";
import { getAccent, getStatusTone, initials } from "@/utils/dashboard/shared";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import CardTitle from "../overview-cards/cardTitle";

export function ClientCardsGrid({ clients }: ClientCardsGridProps) {
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return clients;
    }

    return clients.filter((client) =>
      [client.name, client.goal, client.phone, client.plan]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [clients, query]);

  const activeClients = clients.filter((client) => client.status === "Active");
  const dueEntryClients = clients.filter(
    (client) => client.status === "Due Entry",
  );
  const onboardingClients = clients.filter(
    (client) => client.status === "Onboarding",
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          {activeClients || dueEntryClients || onboardingClients ? (
            <CardTitle
              title="My Clients"
              subtitle={` ${activeClients.length} active clients |  ${dueEntryClients.length} due entry clients | ${onboardingClients.length} onboarding clients`}
            />
          ) : (
            <CardTitle title="My Clients" />
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none placeholder:text-dark-5 focus:border-primary dark:border-dark-3 dark:text-white"
          />
          <FormModalTrigger
            buttonLabel="+ Add Client"
            formType="client"
            size="small"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredClients.map((client, index) => (
          <Link
            key={client.id}
            href={ROUTES.DASHBOARD.PERSONAL_COACH.PROGRESS_CLIENT(client.id)}
            className="rounded-[14px] border border-stroke/70 bg-white p-4 shadow-1 transition-shadow hover:shadow-md dark:border-dark-3 dark:bg-gray-dark dark:shadow-card dark:hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    getAccent(index),
                  )}
                >
                  {initials(client.name)}
                </div>
                <div>
                  <div className="font-semibold text-dark dark:text-white">
                    {client.name}
                  </div>
                  <div className="text-xs text-dark-5 dark:text-dark-6">
                    {client.age ? `Male ${client.age}y` : client.goal}
                    {client.height ? ` · ${client.height}cm` : ""}
                    {client.plan ? ` · ${client.plan}` : ""}
                  </div>
                </div>
              </div>

              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  getStatusTone(client.status),
                )}
              >
                {client.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[10px] bg-dark-2/60 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                  Weight
                </div>
                <div className="mt-2 text-xl font-bold text-primary">
                  {client.weight?.toFixed(1) ?? "-"}
                </div>
              </div>
              <div className="rounded-[10px] bg-dark-2/60 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                  Body Fat
                </div>
                <div className="mt-2 text-xl font-bold text-orange-400">
                  {client.bodyFat?.toFixed(1) ?? "-"}%
                </div>
              </div>
              <div className="rounded-[10px] bg-dark-2/60 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                  Lean
                </div>
                <div className="mt-2 text-xl font-bold text-green">
                  {client.leanMass?.toFixed(1) ?? "-"}
                </div>
              </div>
              <div className="rounded-[10px] bg-dark-2/60 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-dark-5 dark:text-dark-6">
                  BMI
                </div>
                <div className="mt-2 text-xl font-bold text-primary">
                  {client.bmi?.toFixed(1) ?? "-"}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs">
              <span className="text-dark-5">
                Last{" "}
                {new Date(client.lastEntryAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {/* <span
                className={cn(
                  "font-semibold",
                  client.status === "Due Entry"
                    ? "text-[#FFA70B]"
                    : "text-green",
                )}
              >
                {client.progressNote}
              </span> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
