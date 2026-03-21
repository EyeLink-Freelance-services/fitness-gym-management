"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_CLIENT_ROWS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

const filterInputClasses =
  "h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white";
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
        return <span className="text-dark-6 dark:text-dark-6">—</span>;
      }

      return (
        <span className="text-dark-6 dark:text-dark-6">
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
          COMPANY_CLIENT_ROWS.map((row) => row.coach ?? unassignedCoachOption),
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
          COMPANY_CLIENT_ROWS.map((row) => row.status).filter(
            (status): status is string => Boolean(status),
          ),
        ),
      ),
    ],
    [],
  );

  const filteredRows = useMemo(
    () =>
      COMPANY_CLIENT_ROWS.filter((row) => {
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
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Assign Client"
          formType="assignClient"
          size="small"
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
