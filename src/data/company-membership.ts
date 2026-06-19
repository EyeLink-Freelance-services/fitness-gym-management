import * as Icons from "@/components/IconsCollection/icons";
import type {
  MembershipDistributionItem,
  MembershipPlanCardItem,
  MembershipPromotionRow,
  MembershipRevenueBucket,
  MembershipRevenueTimeFrame,
} from "@/types/dashboard/membership";
import { DashboardOverviewItem } from "@/types/shared";

export const COMPANY_MEMBERSHIP_OVERVIEW: DashboardOverviewItem[] = [
  {
    label: "Active Plans",
    value: "5",
    trend: 4.2,
    note: "2 inactive drafts",
    Icon: Icons.Product,
  },
  {
    label: "Members Enrolled",
    value: "412",
    trend: 14,
    note: "+14 this week",
    Icon: Icons.Users,
  },
  {
    label: "Active Promos",
    value: "6",
    trend: 2.6,
    note: "2 expiring soon",
    Icon: Icons.Gym,
  },
  {
    label: "Plan Revenue / Mo (Rs)",
    value: "38.2K",
    trend: 5.3,
    note: "+5.3% vs last month",
    Icon: Icons.Profit,
  },
];

export const COMPANY_MEMBERSHIP_PLANS: MembershipPlanCardItem[] = [
  {
    id: "basic",
    category: "Monthly",
    name: "Basic",
    price: "Rs 80",
    billingLabel: "/month",
    durationLabel: "30 Days",
    accent: "sky",
    members: 94,
    revenue: "Rs 7.5K",
    features: [
      { label: "Full gym access", included: true },
      { label: "Locker & shower", included: true },
      { label: "1 group class/week", included: true },
      { label: "PT sessions", included: false },
      { label: "Nutrition support", included: false },
    ],
    editToast: "Plan editor is not connected yet.",
    secondaryActionLabel: "Deactivate",
    secondaryActionVariant: "outlineDark",
    secondaryActionToast: "Plan activation flow is not connected yet.",
  },
  {
    id: "standard",
    category: "Monthly",
    name: "Standard",
    price: "Rs 150",
    billingLabel: "/month",
    durationLabel: "30 Days",
    accent: "primary",
    isFeatured: true,
    members: 148,
    revenue: "Rs 22.2K",
    features: [
      { label: "Full gym access", included: true },
      { label: "Locker & shower", included: true },
      { label: "Unlimited group classes", included: true },
      { label: "2 PT sessions / month", included: true },
      { label: "Nutrition support", included: false },
    ],
    editToast: "Plan editor is not connected yet.",
    secondaryActionLabel: "Deactivate",
    secondaryActionVariant: "outlinePrimary",
    secondaryActionToast: "Plan activation flow is not connected yet.",
  },
  {
    id: "premium",
    category: "Monthly",
    name: "Premium",
    price: "Rs 250",
    billingLabel: "/month",
    durationLabel: "30 Days",
    accent: "violet",
    members: 112,
    revenue: "Rs 28.0K",
    features: [
      { label: "24/7 gym access", included: true },
      { label: "Unlimited group classes", included: true },
      { label: "4 PT sessions / month", included: true },
      { label: "Recovery zone access", included: true },
      { label: "Nutrition support", included: false },
    ],
    editToast: "Plan editor is not connected yet.",
    secondaryActionLabel: "Deactivate",
    secondaryActionVariant: "outlineDark",
    secondaryActionToast: "Plan activation flow is not connected yet.",
  },
];

export const COMPANY_MEMBERSHIP_REVENUE: Record<
  MembershipRevenueTimeFrame,
  MembershipRevenueBucket[]
> = {
  "this month": [
    { label: "Basic", revenue: 7.5 },
    { label: "Standard", revenue: 22.2 },
    { label: "Premium", revenue: 28.0 },
  ],
  "this quarter": [
    { label: "Basic", revenue: 21.4 },
    { label: "Standard", revenue: 63.8 },
    { label: "Premium", revenue: 81.6 },
  ],
};

export const COMPANY_MEMBERSHIP_DISTRIBUTION: Record<
  MembershipRevenueTimeFrame,
  MembershipDistributionItem[]
> = {
  "this month": [
    { label: "Basic", value: 94, color: "#94A3B8" },
    { label: "Standard", value: 148, color: "#2563EB" },
    { label: "Premium", value: 112, color: "#7C3AED" },
  ],
  "this quarter": [
    { label: "Basic", value: 88, color: "#94A3B8" },
    { label: "Standard", value: 142, color: "#2563EB" },
    { label: "Premium", value: 105, color: "#7C3AED" },
  ],
};

export const COMPANY_MEMBERSHIP_PROMOTIONS: MembershipPromotionRow[] = [
  {
    code: "NEWYEAR25",
    title: "New Year - 25% off first month",
    description:
      "Valid on Standard & Premium. Expires 31 Mar 2026. Auto-applies on signup.",
    used: 47,
    limit: null,
    status: "Active",
    statusTone: "success",
    actionLabel: "Edit",
    actionVariant: "outlineDark",
    actionToast: "Promo editor is not connected yet.",
  },
  {
    code: "REFER50",
    title: "Referral - Rs 50 credit on next renewal",
    description: "All plans. No expiry. Referral programme.",
    used: 22,
    limit: 100,
    status: "Active",
    statusTone: "success",
    actionLabel: "Edit",
    actionVariant: "outlineDark",
    actionToast: "Promo editor is not connected yet.",
  },
  {
    code: "ELITE30",
    title: "Elite upgrade - 30% off first 3 months",
    description: "Elite plan only. Expires 15 Mar 2026. Expiring soon.",
    used: 8,
    limit: 20,
    status: "Expiring",
    statusTone: "warning",
    actionLabel: "Edit",
    actionVariant: "outlineDark",
    actionToast: "Promo editor is not connected yet.",
  },
  {
    code: "XMAS2025",
    title: "Christmas - 20% off all plans",
    description: "All plans. Expired 31 Dec 2025.",
    used: 134,
    limit: 200,
    status: "Expired",
    statusTone: "neutral",
    actionLabel: "Duplicate",
    actionVariant: "outlinePrimary",
    actionToast: "Promo duplication is not connected yet.",
  },
];
