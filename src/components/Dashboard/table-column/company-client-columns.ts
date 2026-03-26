import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import type { TableUIColumn } from "@/types/shared";

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const expiringSoonColumns: TableUIColumn<CompanyClientRow>[] = [
  { key: "name", label: "Client Name", align: "left", headClassName: "min-w-[140px]" },
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
    key: "name",
    label: "Client Name",
    align: "left",
    headClassName: "min-w-[140px]",
  },
  {
    key: "coach",
    label: "Coach Name",
    align: "left",
    render: (row) => row.coach ?? "Unassigned",
    headClassName: "min-w-[160px]",
  },
  { key: "status", label: "Status", headClassName: "min-w-[120px]" },
  {
    key: "assignedOn",
    label: "Assigned On",
    render: (row) => formatDate(row.assignedOn),
    headClassName: "min-w-[140px]",
  },
];
