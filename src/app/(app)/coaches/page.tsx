"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_COACH_ROWS } from "@/data/company-coaches";
import type { CompanyCoachRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<CompanyCoachRow>[] = [
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
    accessorKey: "email",
    header: "Email",
    meta: {
      align: "left",
      headClassName: "min-w-[260px]",
    },
  },
  {
    accessorKey: "clients",
    header: "Clients",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge label={row.original.status} tone={row.original.statusTone} />
    ),
  },
];

export default function CompanyCoachesPage() {
  return (
    <>
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Coach"
          formType="personal"
          size="small"
        />
      </div>

      <DataTable
        title="Coaches"
        description="Coach availability and current client load."
        data={COMPANY_COACH_ROWS}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName="min-w-[860px]"
        searchPlaceholder="Search coach, email, status..."
        initialPageSize={10}
        emptyStateLabel="No coaches available."
      />
    </>
  );
}
