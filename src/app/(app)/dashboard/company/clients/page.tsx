"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_CLIENT_ROWS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";

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
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => row.original.contact ?? "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => row.original.plan ?? "-",
    meta: {
      align: "left",
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
        return <span className="text-dark-6 dark:text-dark-6">-</span>;
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
  {
    accessorKey: "expiresAt",
    header: "Expires At",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-6">
        {row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-"}
      </span>
    ),
  },
];

export default function CompanyClientsPage() {
  return (
    <>
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Client"
          formType="client"
          size="small"
        />
      </div>

      <DataTable
        title="Clients"
        description="Recently joined clients from the shared company dataset."
        data={COMPANY_CLIENT_ROWS}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName="min-w-[780px]"
        searchPlaceholder="Search client, contact, plan..."
        initialPageSize={8}
        emptyStateLabel="No clients available."
      />
    </>
  );
}
