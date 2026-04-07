"use client";

import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { Member } from "@/types/member";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export function ClientsTable({ members }: { members: Member[] }) {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.original.first_name} {row.original.last_name}</span>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <span>{row.original.gender}</span>,
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span>{row.original.phone}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.status ?? "Unknown"}
          tone={row.original.status === 'active' ? "success"  : "neutral"}
        />
      ),
    },
  ];

  return (
    <DataTable
      title="Clients"
      description="All registered members"
      data={members}
      onRowClick={(row) => {
        router.push(`/clients/${row.id}`);
      }}
      columns={columns}
      tableClassName="min-w-[780px]"
      searchPlaceholder="Search clients..."
      initialPageSize={8}
      emptyStateLabel="No clients available."
    />
  );
}