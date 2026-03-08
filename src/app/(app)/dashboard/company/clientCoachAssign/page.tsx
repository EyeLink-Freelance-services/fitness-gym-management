"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { GYM_CLIENTS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

const filterInputClasses =
  "h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white";

const companyClientRows = buildCompanyClientRows(GYM_CLIENTS);
const unassignedCoachOption = "Unassigned";

const columns: ColumnDef<CompanyClientRow>[] = [
  {
    accessorKey: "name",
    header: "Client Name",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.name}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[220px]",
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => row.original.contact ?? "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => row.original.plan ?? "—",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "coach",
    header: "Coach",
    cell: ({ row }) => row.original.coach ?? "Unassigned",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.status ?? "Unknown"}
        tone={row.original.statusTone ?? "neutral"}
      />
    ),
    meta: {
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: ({ row }) => {
      if (!row.original.joinedAt) {
        return <span className="text-dark-6 dark:text-dark-5">—</span>;
      }

      return (
        <span className="text-dark-6 dark:text-dark-5">
          {new Date(row.original.joinedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
];

export default function ClientCoachAssignPage() {
  const [selectedCoach, setSelectedCoach] = useState("All Coaches");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const coachOptions = useMemo(
    () => [
      "All Coaches",
      ...Array.from(
        new Set(
          companyClientRows.map((row) => row.coach ?? unassignedCoachOption),
        ),
      ),
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      "All Statuses",
      ...Array.from(
        new Set(
          companyClientRows
            .map((row) => row.status)
            .filter((status): status is string => Boolean(status)),
        ),
      ),
    ],
    [],
  );

  const filteredRows = useMemo(
    () =>
      companyClientRows.filter((row) => {
        const matchesCoach =
          selectedCoach === "All Coaches"
            ? true
            : (row.coach ?? unassignedCoachOption) === selectedCoach;
        const matchesStatus =
          selectedStatus === "All Statuses"
            ? true
            : row.status === selectedStatus;

        return matchesCoach && matchesStatus;
      }),
    [selectedCoach, selectedStatus],
  );

  return (
    <>
      <div className="flex">
        <Button
          label="Add Member"
          className="mb-4 ml-auto"
          toastMessage="Form not yet created"
        />
      </div>

      <DataTable
        title="Client Coach Assignments"
        description={`Clients grouped by coach assignment. ${filteredRows.length} matching result${filteredRows.length === 1 ? "" : "s"}.`}
        data={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName="min-w-[980px]"
        searchPlaceholder="Search client, contact, plan, coach..."
        initialPageSize={10}
        emptyStateLabel="No client assignments available."
        headerActions={
          <div className="grid w-full gap-3 xl:grid-cols-2">
            <select
              value={selectedCoach}
              onChange={(event) => setSelectedCoach(event.target.value)}
              className={filterInputClasses}
            >
              {coachOptions.map((coach) => (
                <option key={coach} value={coach}>
                  {coach}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className={filterInputClasses}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        }
      />
    </>
  );
}
