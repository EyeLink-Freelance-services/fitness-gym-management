import type { StatusTone } from "@/types/shared";

export function formatProfileDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export function formatGender(value: string): string {
  const labels: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    PREFER_NOT_TO_SAY: "Prefer not to say",
  };
  return labels[value] ?? (value || "—");
}

export function getClientInitials(first: string, last: string): string {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
}

export function planStatusTone(status?: string): StatusTone {
  if (status === "ACTIVE") return "success";
  if (status === "EXPIRED") return "danger";
  if (status === "INACTIVE") return "warning";
  return "neutral";
}

export function membershipDuration(joinedAt?: string): string {
  if (!joinedAt) return "—";
  const d = new Date(joinedAt);
  if (Number.isNaN(d.getTime())) return "—";
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${years}y ${months}mo` : `${years}y`;
}
