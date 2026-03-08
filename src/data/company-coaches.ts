import type { CompanyCoachRow } from "@/types/dashboard/company-directory";

export const COMPANY_COACH_ROWS: CompanyCoachRow[] = [
  {
    id: "coach-1",
    name: "John Smith",
    email: "john@example.com",
    clients: 12,
    status: "Active",
    statusTone: "success",
  },
  {
    id: "coach-2",
    name: "Sarah Lee",
    email: "sarah@example.com",
    clients: 8,
    status: "Active",
    statusTone: "success",
  },
  {
    id: "coach-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    clients: 15,
    status: "Active",
    statusTone: "success",
  },
  {
    id: "coach-4",
    name: "Emma Wilson",
    email: "emma@example.com",
    clients: 6,
    status: "On leave",
    statusTone: "warning",
  },
];
