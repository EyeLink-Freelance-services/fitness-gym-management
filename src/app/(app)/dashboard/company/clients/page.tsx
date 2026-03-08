"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { COMPANY_CLIENT_ROWS } from "@/data/company-clients";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";

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
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: {
      align: "left",
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-5">
        {new Date(row.original.joinedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
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
