import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";

export const getDurationLabel = (plan: MembershipPlanRow) => {
  if (plan.is_monthly) {
    const months = plan.duration_days / 30;
    if (months === 1) return "1 month";
    if (Number.isInteger(months)) return `${months} months`;
  }

  if (plan.duration_days === 1) return "1 day";
  if (plan.duration_days < 30) return `${plan.duration_days} days`;

  return `${plan.duration_days} days`;
};