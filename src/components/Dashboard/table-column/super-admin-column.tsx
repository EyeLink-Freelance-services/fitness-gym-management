import { StatusBadge } from "@/components/ui-elements/status-badge";
import {
  SuperAdminCoachesRow,
  SuperAdminCompanyRow,
  type StatusOpt,
} from "@/types/dashboard/super-admin";
import type { StatusTone } from "@/types/shared";
import type { TableUIColumn } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";

function getStatusTone(status: StatusOpt): StatusTone {
  return status === "Active" ? "success" : "neutral";
}

export const superAdminCoachColumns: ColumnDef<SuperAdminCoachesRow>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "phone_num",
    header: "Phone",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { align: "left", headClassName: "min-w-[200px]" },
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "coaching_mode",
    header: "Coaching Mode",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.status}
        tone={getStatusTone(row.original.status)}
      />
    ),
    meta: { align: "left", headClassName: "min-w-[120px]" },
  },
];

export const superAdminCoachPreviewColumns: TableUIColumn<SuperAdminCoachesRow>[] =
  [
    {
      key: "coach_name",
      label: "Name",
      align: "left",
      render: (row) => `${row.first_name} ${row.last_name}`,
      headClassName: "min-w-[180px]",
    },
    {
      key: "contact_num",
      label: "Phone",
      align: "left",
      render: (row) => row.phone_num,
      headClassName: "min-w-[160px]",
    },
    {
      key: "coaching_mode",
      label: "Coaching Mode",
      align: "left",
      headClassName: "min-w-[150px]",
    },
    {
      key: "location",
      label: "Location",
      align: "left",
      render: (row) => row.location || "N/A",
      headClassName: "min-w-[150px]",
    },
  ];

export const superAdminCompanyColumns: ColumnDef<SuperAdminCompanyRow>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
    meta: { align: "left", headClassName: "min-w-[180px]" },
  },
  {
    accessorKey: "email",
    header: "Company Email",
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "business_reg_no",
    header: "BRN",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "contact_number",
    header: "Contact",
    meta: { align: "left", headClassName: "min-w-[150px]" },
  },
  {
    accessorKey: "address_line_1",
    header: "Address",
    cell: ({ row }) => (
      <span>
        {row.original.address_line_1}, {row.original.city}
      </span>
    ),
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "standard_price",
    header: "Standard Price",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
];

export const superAdminCompanyPreviewColumns: TableUIColumn<SuperAdminCompanyRow>[] =
  [
    {
      key: "company_name",
      label: "Name",
      align: "left",
      render: (row) => `${row.company_name}`,
      headClassName: "min-w-[140px] max-w-[150px]",
    },
    {
      key: "contact_num",
      label: "Phone",
      align: "left",
      render: (row) => row.contact_number,
      headClassName: "min-w-[140px]",
    },
    {
      key: "brn",
      label: "BRN",
      align: "left",
      render: (row) => row.business_reg_no,
      headClassName: "min-w-[140px] max-w-[150px]",
    },
    {
      key: "address",
      label: "Address",
      align: "left",
      render: (row) => `${row.district}, ${row.city}`,
      headClassName: "min-w-[180px] max-w-[190px]",
    },
  ];
