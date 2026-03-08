import type { StatusTone } from "@/types/shared";

export function getMembershipStatus(expiresAt: string): {
  label: string;
  tone: StatusTone;
} {
  const today = new Date();
  const expiryDate = new Date(expiresAt);
  const diffInDays = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) {
    return { label: "Expired", tone: "danger" };
  }

  if (diffInDays <= 30) {
    return { label: "Expiring", tone: "warning" };
  }

  return { label: "Active", tone: "success" };
}

export function formatPlanLabel(plan: string) {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}
