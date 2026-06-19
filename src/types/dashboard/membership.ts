import type { ButtonColorVariant, StatusTone, TableUIColumn } from "@/types/shared";

export type MembershipRevenueTimeFrame = "this month" | "this quarter";

export type MembershipPlanAccent = "sky" | "amber" | "primary" | "violet" | "green";

export interface MembershipPlanFeature {
  label: string;
  included: boolean;
}

export interface MembershipPlanCardItem {
  id: string;
  category: string;
  name: string;
  price: string;
  billingLabel: string;
  durationLabel: string;
  accent: MembershipPlanAccent;
  isFeatured?: boolean;
  members: number;
  revenue: string;
  features: MembershipPlanFeature[];
  editToast: string;
  secondaryActionLabel: string;
  secondaryActionVariant: ButtonColorVariant;
  secondaryActionToast: string;
}

export interface MembershipRevenueBucket {
  label: string;
  revenue: number;
}

export interface MembershipDistributionItem {
  label: string;
  value: number;
  color: string;
}

export interface MembershipPromotionRow {
  code: string;
  title: string;
  description: string;
  used: number;
  limit: number | null;
  status: string;
  statusTone: StatusTone;
  actionLabel: string;
  actionVariant: ButtonColorVariant;
  actionToast: string;
}

export interface MembershipPlanCatalogProps {
  plans: MembershipPlanCardItem[];
}

export interface MembershipPlanCardProps {
  plan: MembershipPlanCardItem;
}

export interface MembershipPlanRevenueChartProps {
  data: MembershipRevenueBucket[];
}

export interface MembershipMemberDistributionChartProps {
  data: MembershipDistributionItem[];
}

export interface MembershipPromotionsTableProps {
  rows: MembershipPromotionRow[];
}

export interface MembershipPromotionsTableColumn
  extends TableUIColumn<MembershipPromotionRow> {}
