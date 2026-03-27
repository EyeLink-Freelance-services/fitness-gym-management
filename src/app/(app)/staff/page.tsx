"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_CLIENT_ROWS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";

const memberRows = COMPANY_CLIENT_ROWS.filter(
  (c): c is CompanyClientRow & { plan: string; expiresAt: string } =>
    Boolean(c.plan && c.expiresAt),
);

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
  {
    accessorKey: "membershipStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.membershipStatus ?? "-"}
        tone={row.original.membershipStatusTone ?? "neutral"}
      />
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
        description="Membership records from the shared company client dataset."
        data={memberRows}
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
