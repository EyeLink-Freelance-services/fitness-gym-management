"use client";

import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { DataTable } from "@/components/Tables";
import type {
  PaymentRenewalRow,
  PaymentRenewalsTableProps,
} from "@/types/dashboard/payment";
import type { ColumnDef } from "@tanstack/react-table";
import { PaymentAutoRenewBadge } from "./payment-auto-renew-badge";
import { PaymentMemberCell } from "./payment-member-cell";

const columns: ColumnDef<PaymentRenewalRow>[] = [
  {
    id: "member",
    accessorFn: (row) => `${row.member.name} ${row.member.email}`,
    header: "Member",
    cell: ({ row }) => <PaymentMemberCell member={row.original.member} />,
    meta: {
      align: "left",
      headClassName: "min-w-[240px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {row.original.plan}
      </span>
    ),
  },
  {
    accessorKey: "amountDue",
    header: "Amount Due",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.amountDue}
      </span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "daysLeft",
    header: "Days Left",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.daysLeft}
        tone={row.original.daysLeftTone}
      />
    ),
  },
  {
    id: "autoRenew",
    accessorFn: (row) => (row.autoRenew ? "Enabled" : "Off"),
    header: "Auto-Renew",
    cell: ({ row }) => (
      <PaymentAutoRenewBadge enabled={row.original.autoRenew} />
    ),
  },
  {
    id: "action",
    accessorFn: () => "",
    header: "Action",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <Button
        label={row.original.actionLabel}
        size="small"
        variant={row.original.actionVariant}
        toastMessage={row.original.actionToast}
      />
    ),
    meta: {
      align: "right",
    },
  },
];

export function PaymentRenewalsTable({ rows }: PaymentRenewalsTableProps) {
  return (
    <DataTable
      title="Upcoming Renewals"
      description="Members due for payment in the next 14 days."
      data={rows}
      columns={columns}
      getRowId={(row) => `${row.member.email}-${row.dueDate}`}
      tableClassName="min-w-[920px]"
      initialPageSize={5}
      showFooter={false}
      headerActions={
        <Button
          label="Remind All"
          size="small"
          variant="outlinePrimary"
          toastMessage="Bulk reminder flow is not connected yet."
        />
      }
    />
  );
}
