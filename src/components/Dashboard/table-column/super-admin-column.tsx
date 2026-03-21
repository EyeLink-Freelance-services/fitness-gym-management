import { StatusBadge } from "@/components/ui-elements/status-badge";
import {
  SuperAdminCoachesRow,
  SuperAdminCompanyRow,
  type StatusOpt,
} from "@/types/dashboard/super-admin";
import type { StatusTone } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";

function getStatusTone(status: StatusOpt): StatusTone {
  return status === "Active" ? "success" : "neutral";
}

export const superAdminCoachColumns: ColumnDef<SuperAdminCoachesRow>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "phone_num",
    header: "Contact",
    meta: { align: "left", headClassName: "min-w-[150px]" },
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
    accessorKey: "location",
    header: "Location",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "clients",
    header: "Clients",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {row.original.clients}
      </span>
    ),
    meta: { align: "center", headClassName: "min-w-[100px]" },
  },
  {
    accessorKey: "statusTone",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.statusTone}
        tone={getStatusTone(row.original.statusTone)}
      />
    ),
    meta: { align: "left", headClassName: "min-w-[120px]" },
  },
];


export const superAdminCompanyColumns: ColumnDef<SuperAdminCompanyRow>[] = [
  {
    accessorKey: "company_name",
    header: "Company Name",
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
    accessorKey: "postcode",
    header: "Postcode",
    meta: { align: "left", headClassName: "min-w-[100px]" },
  },

  {
    accessorKey: "district",
    header: "District",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },

  {
    accessorKey: "branches",
    header: "Branches",
    cell: ({ row }) =>
      row.original.branches.length > 0 ? (
        <span>{row.original.branches.join(", ")}</span>
      ) : (
        <span className="text-dark-5 text-xs">None</span>
      ),
    meta: { align: "left", headClassName: "min-w-[200px]" },
  },
];
