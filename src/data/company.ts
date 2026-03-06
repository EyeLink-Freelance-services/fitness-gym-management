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

export const EXPIRING_MEMBERSHIPS = [
  {
    member: "Alex Brown",
    plan: "Premium",
    expiresAt: "2024-04-10",
  },
  {
    member: "Jane Doe",
    plan: "Basic",
    expiresAt: "2025-03-12",
  },
  {
    member: "Jane Six",
    plan: "Basic",
    expiresAt: "2025-04-12",
  },
  {
    member: "Jane Five",
    plan: "Basic",
    expiresAt: "2025-01-12",
  },
  {
    member: "Doe",
    plan: "Basic",
    expiresAt: "2026-03-15",
  },
  {
    member: "Janoe",
    plan: "Basic",
    expiresAt: "2026-03-12",
  },
  {
    member: "D",
    plan: "Basic",
    expiresAt: "2026-03-12",
  },
  {
    member: "A",
    plan: "Basic",
    expiresAt: "2026-04-12",
  },
  {
    member: "B",
    plan: "Basic",
    expiresAt: "2024-03-12",
  },
  {
    member: "C",
    plan: "Basic",
    expiresAt: "2027-03-12",
  },
];

export const COACH_ASSIGNMENTS = [
  {
    client: "Alex Brown",
    coach: "John Smith",
    status: "Assigned",
  },
  {
    client: "New User",
    coach: "—",
    status: "Pending",
  },
];

export const ANNOUNCEMENTS = [
  {
    title: "Holiday hours",
    date: "Mar 1",
  },
  {
    title: "New class: HIIT",
    date: "Mar 2",
  },
];

export const MEDICAL_ALERTS = [
  {
    name: "Chris Lee",
    note: "Knee injury — low impact only",
  },
];

export const PENDING_COACH = [
  {
    name: "New User",
    joined: "Mar 2",
  },
];
