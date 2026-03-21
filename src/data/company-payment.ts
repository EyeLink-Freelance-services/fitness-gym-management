import * as Icons from "@/components/IconsCollection/icons";
import type {
  CompanyPaymentAlert,
  PaymentCollectionBucket,
  PaymentCollectionsTimeFrame,
  PaymentMemberSummary,
  PaymentRenewalRow,
  PaymentTableFilters,
  PaymentTransactionRow,
} from "@/types/dashboard/payment";
import { DashboardOverviewItem } from "@/types/shared";
import { GYM_CLIENTS } from "@/data/company";

function toPaymentMember(client: { name: string; contact?: string }): PaymentMemberSummary {
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    name: client.name,
    email: `${client.name.toLowerCase().replace(/\s/g, ".")}@example.com`,
    initials: initials || "—",
    avatarTone: "emerald",
  };
}

const SINGLE_CLIENT = GYM_CLIENTS[0];
const MEMBER = SINGLE_CLIENT ? toPaymentMember(SINGLE_CLIENT) : null;

export const COMPANY_PAYMENT_OVERVIEW: DashboardOverviewItem[] = [
  {
    label: "Collected This Month",
    value: "Rs 33,580",
    trend: 5.3,
    note: "+5.3% vs last month",
    Icon: Icons.Profit,
  },
  {
    label: "Pending / Overdue",
    value: "Rs 4,820",
    trend: -2.4,
    note: "8 unpaid invoices",
    Icon: Icons.Product,
  },
  {
    label: "Expected Renewals",
    value: "Rs 12,450",
    trend: 4.1,
    note: "Due in next 14 days",
    Icon: Icons.Views,
  },
  {
    label: "Refunds Issued",
    value: "Rs 630",
    trend: -1.2,
    note: "3 this month",
    Icon: Icons.Gym,
  },
];

export const COMPANY_PAYMENT_ALERT: CompanyPaymentAlert = {
  title: "8 members have overdue payments totalling Rs 4,820",
  description:
    "Oldest overdue: 18 days. Consider suspending access for members overdue by more than 5 days.",
  primaryActionLabel: "Remind All",
  secondaryActionLabel: "View Overdue",
};

export const COMPANY_PAYMENT_COLLECTIONS: Record<
  PaymentCollectionsTimeFrame,
  PaymentCollectionBucket[]
> = {
  "last 6 months": [
    { month: "Oct", collected: 28.4, expected: 30.1, overdue: 0.9 },
    { month: "Nov", collected: 31.2, expected: 32.0, overdue: 0.7 },
    { month: "Dec", collected: 29.7, expected: 31.0, overdue: 1.2 },
    { month: "Jan", collected: 32.1, expected: 33.4, overdue: 0.8 },
    { month: "Feb", collected: 31.9, expected: 33.0, overdue: 1.0 },
    { month: "Mar", collected: 33.6, expected: 34.4, overdue: 2.1 },
  ],
  "last 12 months": [
    { month: "Apr", collected: 24.8, expected: 26.2, overdue: 0.6 },
    { month: "May", collected: 25.9, expected: 27.5, overdue: 0.7 },
    { month: "Jun", collected: 26.4, expected: 27.9, overdue: 0.6 },
    { month: "Jul", collected: 27.1, expected: 28.6, overdue: 0.7 },
    { month: "Aug", collected: 27.8, expected: 29.1, overdue: 0.8 },
    { month: "Sep", collected: 28.0, expected: 29.5, overdue: 0.9 },
    { month: "Oct", collected: 28.4, expected: 30.1, overdue: 0.9 },
    { month: "Nov", collected: 31.2, expected: 32.0, overdue: 0.7 },
    { month: "Dec", collected: 29.7, expected: 31.0, overdue: 1.2 },
    { month: "Jan", collected: 32.1, expected: 33.4, overdue: 0.8 },
    { month: "Feb", collected: 31.9, expected: 33.0, overdue: 1.0 },
    { month: "Mar", collected: 33.6, expected: 34.4, overdue: 2.1 },
  ],
};

export const COMPANY_PAYMENT_TABLE_FILTERS: PaymentTableFilters = {
  statuses: ["All Status", "Paid", "Pending", "Overdue", "Promo Applied"],
  plans: ["All Plans", "Basic", "Standard", "Elite", "Premium"],
  methods: ["All Methods", "Online", "Card", "Cash"],
  months: ["March 2026", "February 2026", "January 2026"],
};

/** Payment transactions derived from GYM_CLIENTS (single source of truth). */
export const COMPANY_PAYMENT_TRANSACTIONS: PaymentTransactionRow[] = MEMBER && SINGLE_CLIENT
  ? [
      {
        invoice: "#INV-2026-0341",
        member: MEMBER,
        plan: SINGLE_CLIENT.plan ?? "Premium",
        amount: "Rs 250.00",
        method: "Online",
        date: "1 Mar 2026",
        autoRenew: true,
        status: "Paid",
        statusTone: "success",
        actionLabel: "Invoice",
        actionVariant: "outlineDark",
        actionToast: "Invoice preview is not available yet.",
      },
      {
        invoice: "#INV-2026-0338",
        member: MEMBER,
        plan: SINGLE_CLIENT.plan ?? "Premium",
        amount: "Rs 250.00",
        method: "Card",
        date: "1 Feb 2026",
        autoRenew: true,
        status: "Pending",
        statusTone: "warning",
        actionLabel: "Mark Paid",
        actionVariant: "outlineGreen",
        actionToast: "Mark-paid flow is not connected yet.",
      },
      {
        invoice: "#INV-2026-0330",
        member: MEMBER,
        plan: SINGLE_CLIENT.plan ?? "Premium",
        amount: "Rs 250.00",
        method: "Cash",
        date: "1 Jan 2026",
        autoRenew: false,
        status: "Overdue 12d",
        statusTone: "danger",
        actionLabel: "Remind",
        actionVariant: "outlinePrimary",
        actionToast: "Reminder flow is not connected yet.",
      },
    ]
  : [];

/** Payment renewals derived from GYM_CLIENTS (single source of truth). */
export const COMPANY_PAYMENT_RENEWALS: PaymentRenewalRow[] = MEMBER && SINGLE_CLIENT
  ? [
      {
        member: MEMBER,
        plan: SINGLE_CLIENT.plan ?? "Premium",
        amountDue: "Rs 250.00",
        dueDate: SINGLE_CLIENT.expiresAt ?? "2026-03-20",
        daysLeft: "29 days",
        daysLeftTone: "success",
        autoRenew: true,
        actionLabel: "Remind",
        actionVariant: "outlineDark",
        actionToast: "Reminder flow is not connected yet.",
      },
    ]
  : [];
