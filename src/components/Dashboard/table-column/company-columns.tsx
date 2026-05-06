import { StatusBadge } from "@/components/ui-elements/status-badge";
import type {
  CompanyClientRow,
  CompanyCoachesRow,
  CompanyStaffRow,
} from "@/types/dashboard/company";
import type { TableUIColumn } from "@/types/shared";
import type { ColumnDef } from "@tanstack/react-table";
function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
export const expiringSoonColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  { key: "plan", label: "Plan", align: "left", headClassName: "min-w-[120px]" },
  {
    key: "expiresAt",
    label: "Expires At",
    render: (row) => formatDate(row.expiresAt),
    headClassName: "min-w-[140px]",
  },
];
export const newSignupColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "contact",
    label: "Contact",
    align: "left",
    render: (row) => row.contact ?? "N/A",
    headClassName: "min-w-[140px]",
  },
  { key: "plan", label: "Plan", align: "left", headClassName: "min-w-[120px]" },
  {
    key: "joinedAt",
    label: "Joined At",
    render: (row) => formatDate(row.joinedAt),
    headClassName: "min-w-[140px]",
  },
];
export const coachAssignmentColumns: TableUIColumn<CompanyClientRow>[] = [
  {
    key: "coach",
    label: "Coach Name",
    align: "left",
    render: (row) => row.coach ?? "Unassigned",
    headClassName: "min-w-[160px]",
  },
  {
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "plan",
    label: "Membership Plan",
    align: "left",
    render: (row) => row.plan ?? "Normal",
    headClassName: "min-w-[120px]",
  },
  {
    key: "assignedOn",
    label: "Assigned On",
    render: (row) => formatDate(row.assignedOn),
    headClassName: "min-w-[140px]",
  },
];

export const companyClientCoachAssignmentColumns: ColumnDef<CompanyClientRow>[] = [
  {
    accessorKey: "name",
    header: "Client Name",
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
    cell: ({ row }) => row.original.contact ?? "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => row.original.plan ?? "-",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "coach",
    header: "Coach",
    cell: ({ row }) => row.original.coach ?? "Unassigned",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.status ?? "Unknown"}
        tone={row.original.statusTone ?? "neutral"}
      />
    ),
    meta: {
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-6">
        {formatDate(row.original.joinedAt)}
      </span>
    ),
    meta: {
      headClassName: "min-w-[140px]",
    },
  },
];

export const companyClientColumns: ColumnDef<CompanyClientRow>[] = [
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
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => row.original.contact ?? "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => row.original.plan ?? "-",
    meta: {
      align: "left",
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `Rs ${row.original.price}`,
    meta: {
      align: "left",
      headClassName: "min-w-[120px]",
    },
  },
  {
    accessorKey: "coachAssign",
    header: "Coach Assigned",
    cell: ({ row }) => row.original.coach ?? " - ",
    meta: {
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: ({ row }) => (
      <span className="text-dark-6 dark:text-dark-6">
        {formatDate(row.original.joinedAt)}
      </span>
    ),
  },
];
export const companyStaffColumns: ColumnDef<CompanyStaffRow>[] = [
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    meta: { align: "left", headClassName: "min-w-[220px]" },
  },
  {
    accessorKey: "gym_name",
    header: "Gym Name",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
  {
    accessorKey: "phone_num",
    header: "Phone Number",
    meta: { align: "left", headClassName: "min-w-[140px]" },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { align: "left", headClassName: "min-w-[200px]" },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { align: "left", headClassName: "min-w-[120px]" },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    meta: { align: "left", headClassName: "min-w-[200px]" },
  },
];


export const companyCoachColumns: ColumnDef<CompanyCoachesRow>[] = [
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
    accessorKey: "location",
    header: "Location",
    meta: { align: "left", headClassName: "min-w-[160px]" },
  },
];
