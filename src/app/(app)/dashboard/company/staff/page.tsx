"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_MEMBER_ROWS } from "@/data/company-members";
import type { CompanyMemberRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<CompanyMemberRow>[] = [
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
    accessorKey: "plan",
    header: "Plan",
    meta: {
      align: "left",
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-5">
        {new Date(row.original.expiresAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge label={row.original.status} tone={row.original.statusTone} />
    ),
  },
];

export default function CompanyMembersPage() {
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
        title="Members"
        description="Membership records sourced from the shared company dataset."
        data={COMPANY_MEMBER_ROWS}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName="min-w-[720px]"
        searchPlaceholder="Search member, plan, status..."
        initialPageSize={8}
        emptyStateLabel="No members available."
      />
    </>
  );
}
