"use client";

import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import type {
  AnnouncementMetricRow,
  AnnouncementMetricsTableProps,
} from "@/types/dashboard/announcement";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<AnnouncementMetricRow>[] = [
  {
    accessorKey: "title",
    header: "Announcement",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium text-dark dark:text-white">
          {row.original.title}
        </p>
        <p className="text-sm text-dark-6 dark:text-dark-5">
          {row.original.deliveryLabel}
        </p>
      </div>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[320px]",
    },
  },
  {
    accessorKey: "audience",
    header: "Audience",
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/15">
        {row.original.audience}
      </span>
    ),
    meta: {
      align: "left",
    },
  },
  {
    id: "channels",
    accessorFn: (row) =>
      row.channels.map((channel) => channel.label).join(", "),
    header: "Channels",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.channels.map((channel) => (
          <span
            key={`${row.original.id}-${channel.code}`}
            className="inline-flex rounded-full bg-gray-1 px-2.5 py-1 text-xs font-semibold tracking-[0.16em] text-dark-5 dark:bg-dark-2 dark:text-dark-5"
            title={channel.label}
          >
            {channel.code}
          </span>
        ))}
      </div>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[150px]",
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.priority}
        tone={row.original.priorityTone}
      />
    ),
  },
  {
    accessorKey: "reach",
    header: "Reach",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.reach}
      </span>
    ),
  },
  {
    accessorKey: "opened",
    header: "Open Rate",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.opened}
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

export function AnnouncementMetricsTable({
  rows,
}: AnnouncementMetricsTableProps) {
  return (
    <DataTable
      title="Announcement Performance"
      description="Delivery status and engagement snapshot for recent campaigns."
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      tableClassName="min-w-[1120px]"
      showFooter={false}
      headerActions={
        <Button
          label="Export Report"
          size="small"
          variant="outlineDark"
          toastMessage="Report export is not connected yet."
        />
      }
    />
  );
}
