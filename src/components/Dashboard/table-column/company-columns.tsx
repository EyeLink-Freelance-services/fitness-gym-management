import { StatusBadge } from "@/components/ui-elements/status-badge";
import {
  getClientDisplayFee,
  getCompanyClientFullName,
  getMembershipPlanLabel,
} from "@/modules/company/company-client.mappers";
import type {
  CompanyClient,
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
export const expiringSoonColumns: TableUIColumn<CompanyClient>[] = [
  {
    key: "firstName",
    label: "Client Name",
    align: "left",
    render: (row) => getCompanyClientFullName(row),
    headClassName: "min-w-[140px]",
  },
  {
    key: "membershipPlan",
    label: "Plan",
    align: "left",
    render: (row) => getMembershipPlanLabel(row.membershipPlan),
    headClassName: "min-w-[120px]",
  },
  {
    key: "expiresAt",
    label: "Expires At",
    render: (row) => formatDate(row.expiresAt),
    headClassName: "min-w-[140px]",
  },
];
export const newSignupColumns: TableUIColumn<CompanyClient>[] = [
  {
    key: "firstName",
    label: "Client Name",
    align: "left",
    render: (row) => getCompanyClientFullName(row),
    headClassName: "min-w-[140px]",
  },
  {
    key: "phoneNumber",
    label: "Contact",
    align: "left",
    render: (row) => row.phoneNumber || "N/A",
    headClassName: "min-w-[140px]",
  },
  {
    key: "membershipPlan",
    label: "Plan",
    align: "left",
    render: (row) => getMembershipPlanLabel(row.membershipPlan),
    headClassName: "min-w-[120px]",
  },
  {
    key: "joinedAt",
    label: "Joined At",
    render: (row) => formatDate(row.joinedAt),
    headClassName: "min-w-[140px]",
  },
];
export const coachAssignmentColumns: TableUIColumn<CompanyClient>[] = [
  {
    key: "coachId",
    label: "Coach Name",
    align: "left",
    render: (row) => row.coachId ?? "Unassigned",
    headClassName: "min-w-[160px]",
  },
  {
    key: "firstName",
    label: "Client Name",
    align: "left",
    render: (row) => getCompanyClientFullName(row),
    headClassName: "min-w-[140px]",
  },
  {
    key: "membershipPlan",
    label: "Membership Plan",
    align: "left",
    render: (row) => getMembershipPlanLabel(row.membershipPlan),
    headClassName: "min-w-[120px]",
  },
  {
    key: "assignedOn",
    label: "Assigned On",
    render: (row) => formatDate(row.assignedOn),
    headClassName: "min-w-[140px]",
  },
];

export const companyClientCoachAssignmentColumns: ColumnDef<CompanyClient>[] = [
  {
    id: "name",
    header: "Client Name",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {getCompanyClientFullName(row.original)}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[220px]",
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => row.original.phoneNumber || "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[180px]",
    },
  },
  {
    id: "plan",
    header: "Plan",
    cell: ({ row }) => getMembershipPlanLabel(row.original.membershipPlan),
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "coachId",
    header: "Coach",
    cell: ({ row }) => row.original.coachId ?? "Unassigned",
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

export const companyClientColumns: ColumnDef<CompanyClient>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-dark dark:text-white">
        {getCompanyClientFullName(row.original)}
      </span>
    ),
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => row.original.phoneNumber || "N/A",
    meta: {
      align: "left",
      headClassName: "min-w-[140px]",
    },
  },
  {
    id: "plan",
    header: "Plan",
    cell: ({ row }) => getMembershipPlanLabel(row.original.membershipPlan),
    meta: {
      align: "left",
    },
  },
  {
    id: "fee",
    header: "Fee (Rs)",
    cell: ({ row }) => {
      const fee = getClientDisplayFee(row.original);
      return fee != null ? fee : "-";
    },
    meta: {
      align: "left",
      headClassName: "min-w-[120px]",
    },
  },
  {
    accessorKey: "coachId",
    header: "Coach Assigned",
    cell: ({ row }) => row.original.coachId ?? " - ",
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
