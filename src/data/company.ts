import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import * as Icons from "../components/IconsCollection/icons";

export const DUMMY_KPIS = [
  {
    label: "Total Members",
    value: "1,240",
    trend: 3,
    icon: Icons.Users,
  },
  {
    label: "Active",
    value: "892",
    trend: 1,
    icon: Icons.Views,
  },
  {
    label: "Expiring (30d)",
    value: "48",
    trend: -2,
    icon: Icons.Product,
  },
  {
    label: "Pending Payments",
    value: "12",
    icon: Icons.Profit,
  },
  {
    label: "Revenue",
    value: "$42,100",
    trend: 8,
    icon: Icons.Profit,
  },
  {
    label: "Expenses",
    value: "$18,200",
    trend: -1,
    icon: Icons.Product,
  },
  {
    label: "New Signups",
    value: "34",
    trend: 5,
    icon: Icons.Users,
  },
  {
    label: "Staff",
    value: "24",
    icon: Icons.Users,
  },
];

export const ANNOUNCEMENTS = [
  {
    title: "Gym closure - 12 Mar (Public Holiday)",
    desc: "All branches will be closed. Classes rescheduled.",
    time: "Posted 2 hours ago",
  },
  {
    title: "New class: Muay Thai starts 10 Mar",
    desc: "Register via call before Friday.",
    time: "Posted yesterday",
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
    contact: "0435",
    plan: "Premium",
    joinedAt: "2024-01-10",
    expiresAt: "2026-03-20",
    coach: "John Smith",
    assignedOn: "2024-01-10",
    status: "Assigned",
  },
  {
    id: "client-2",
    name: "New User",
    contact: "5990540",
    plan: "Standard",
    joinedAt: "2026-01-10",
    expiresAt: "2026-03-15",
    coach: "Nac Joy",
    assignedOn: "2025-01-10",
    status: "Pending",
  },
  {
    id: "client-3",
    name: "Jane Doe",
    contact: "0400123456",
    plan: "Basic",
    joinedAt: "2025-11-18",
    expiresAt: "2026-04-05",
    coach: null,
    assignedOn: undefined,
    status: "Unassigned",
  },
];
