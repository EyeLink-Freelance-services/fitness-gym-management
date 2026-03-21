import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import * as Icons from "../components/IconsCollection/icons";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";

export const DUMMY_KPIS = [
  {
    label: "Total Members",
    value: "2",
    trend: 0,
    icon: Icons.Users,
  },
  {
    label: "Active",
    value: "2",
    trend: 0,
    icon: Icons.Views,
  },
  {
    label: "Expiring (30d)",
    value: "1",
    trend: 0,
    icon: Icons.Product,
  },
  {
    label: "Pending Payments (Rs)",
    value: "0",
    icon: Icons.Profit,
  },
  {
    label: "Revenue (Rs)",
    value: "400",
    trend: 0,
    icon: Icons.Profit,
  },
  {
    label: "Expenses (Rs)",
    value: "0",
    trend: 0,
    icon: Icons.Product,
  },
  {
    label: "New Signups",
    value: "0",
    trend: 0,
    icon: Icons.Users,
  },
  {
    label: "Staff",
    value: "1",
    icon: Icons.Users,
  },
];

export const PENDING_COACH = [
  {
    name: "New User",
    joined: "Mar 2",
  },
];

export const GYM_CLIENTS: CompanyClientRow[] = [
  {
    id: "client-1",
    name: "Alex Brown",
    contact: "0435123456",
    plan: "Premium",
    joinedAt: "2024-01-10",
    expiresAt: "2026-04-20",
    coach: "John Smith",
    assignedOn: "2024-01-10",
    status: "Assigned",
  },
  {
    id: "client-2",
    name: "Jordan Lee",
    contact: "0498765432",
    plan: "Standard",
    joinedAt: "2025-09-15",
    expiresAt: "2026-03-26",
    coach: "John Smith",
    assignedOn: "2025-09-15",
    status: "Assigned",
  },
];

export const COMPANY_CLIENT_ROWS = buildCompanyClientRows(GYM_CLIENTS);
