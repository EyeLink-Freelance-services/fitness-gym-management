import type { JSX, SVGProps } from "react";
import type { StatusTone } from "@/types/shared";

export type PaymentButtonVariant =
  | "primary"
  | "green"
  | "dark"
  | "outlinePrimary"
  | "outlineGreen"
  | "outlineDark";

export type PaymentCollectionsTimeFrame = "last 6 months" | "last 12 months";

export interface PaymentOverviewItem {
  label: string;
  value: string;
  trend: number;
  note: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export interface CompanyPaymentAlert {
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}

export interface PaymentCollectionBucket {
  month: string;
  collected: number;
  expected: number;
  overdue: number;
}

export interface PaymentMemberSummary {
  name: string;
  email: string;
  initials: string;
  avatarTone: "emerald" | "rose" | "amber" | "violet" | "sky";
}

export interface PaymentTransactionRow {
  invoice: string;
  member: PaymentMemberSummary;
  plan: string;
  amount: string;
  method: string;
  date: string;
  autoRenew: boolean;
  status: string;
  statusTone: StatusTone;
  actionLabel: string;
  actionVariant: PaymentButtonVariant;
  actionToast: string;
}

export interface PaymentRenewalRow {
  member: PaymentMemberSummary;
  plan: string;
  amountDue: string;
  dueDate: string;
  daysLeft: string;
  daysLeftTone: StatusTone;
  autoRenew: boolean;
  actionLabel: string;
  actionVariant: PaymentButtonVariant;
  actionToast: string;
}

export interface PaymentTableFilters {
  statuses: string[];
  plans: string[];
  methods: string[];
  months: string[];
}

export interface PaymentQuickActionItem {
  label: string;
  description: string;
  variant: PaymentButtonVariant;
  toastMessage: string;
}

export interface PaymentCollectionsChartProps {
  data: PaymentCollectionBucket[];
}

export interface PaymentMemberCellProps {
  member: PaymentMemberSummary;
}

export interface PaymentAutoRenewBadgeProps {
  enabled: boolean;
}

export interface PaymentAlertProps {
  alert: CompanyPaymentAlert;
}

export interface PaymentQuickActionsProps {
  actions: PaymentQuickActionItem[];
}

export interface PaymentTransactionsTableProps {
  rows: PaymentTransactionRow[];
  filters: PaymentTableFilters;
}

export interface PaymentRenewalsTableProps {
  rows: PaymentRenewalRow[];
}
