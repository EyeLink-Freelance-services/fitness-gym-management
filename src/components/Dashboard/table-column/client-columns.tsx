"use client";

import { StatusBadge } from "@/components/ui-elements/status-badge";
import { ClientPaymentRow } from "@/types/dashboard/client";

import { formatDate } from "@/utils/dashboard/shared";
import { ColumnDef } from "@tanstack/react-table";

export const paymentHistoryColumns: ColumnDef<ClientPaymentRow, unknown>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    meta: { align: "left", headClassName: "min-w-[150px]" },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: { align: "left", headClassName: "min-w-[120px]" },
  },
  {
    accessorKey: "amount",
    header: "Amount (Rs)",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.amount}
      </span>
    ),
    meta: { align: "right", headClassName: "min-w-[120px]" },
  },
  {
    accessorKey: "paidAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.paidAt),
    meta: { headClassName: "min-w-[120px]" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge label={row.original.status} tone={row.original.statusTone} />
    ),
    meta: { headClassName: "min-w-[140px]" },
  },
];
