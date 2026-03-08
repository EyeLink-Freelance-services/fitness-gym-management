"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { GYM_CLIENTS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";
import type { ColumnDef } from "@tanstack/react-table";

const companyClientRows = buildCompanyClientRows(GYM_CLIENTS);

const columns: ColumnDef<CompanyClientRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
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
  {
    accessorKey: "expiresAt",
    header: "Expires At",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-5">
        {row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
];

export default function CompanyClientsPage() {
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
        title="Clients"
        description="Recently joined clients from the shared company dataset."
        data={companyClientRows}
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
