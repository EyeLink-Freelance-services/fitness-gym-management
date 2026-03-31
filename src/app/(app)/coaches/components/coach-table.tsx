"use client";

import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { CompanyCoachRow } from "@/types/dashboard/company-directory";
import { Member } from "@/types/member";
import type { ColumnDef } from "@tanstack/react-table";

export function CoachTable({ coaches }: { coaches: CompanyCoachRow[] }) {
  console.log(coaches, 'coaches');

  const columns: ColumnDef<CompanyCoachRow>[] = [
  {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[220px]",
      },
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.specialization}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[260px]",
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.email}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[260px]",
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.phone}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[260px]",
      },
    },
    {
      accessorKey: "clients",
      header: "Clients",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.clients}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge label={row.original.status} tone={row.original.status === "active" ? "success" : "neutral"} />
      ),
    },
  ];

  return (
    <DataTable
      title="Coaches"
      description="All registered coaches"
      data={coaches}
      columns={columns}
      tableClassName="min-w-[780px]"
      searchPlaceholder="Search clients..."
      initialPageSize={8}
      emptyStateLabel="No clients available."
    />
  );
}