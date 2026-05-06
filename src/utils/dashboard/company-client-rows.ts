import type { CompanyClientRow } from "@/types/dashboard/company";
import type { StatusTone } from "@/types/shared";
import { getMembershipStatus } from "@/utils/dashboard/company-directory";

export function getClientCoachAssignmentStatus(
  status: CompanyClientRow["status"],
  coach: CompanyClientRow["coach"],
): {
  label: string;
  tone: StatusTone;
} {
  const normalizedStatus = status?.trim().toLowerCase();

  if (normalizedStatus === "pending") {
    return {
      label: "Pending",
      tone: "warning",
    };
  }

  if (normalizedStatus === "unassigned") {
    return {
      label: "Unassigned",
      tone: "neutral",
    };
  }

  if (normalizedStatus === "assigned") {
    return {
      label: "Assigned",
      tone: "success",
    };
  }

  if (!coach) {
    return {
      label: "Unassigned",
      tone: "neutral",
    };
  }

  return {
    label: "Assigned",
    tone: "success",
  };
}

export function buildCompanyClientRows(
  clients: CompanyClientRow[],
): CompanyClientRow[] {
  return clients.map((client) => {
    const assignmentStatus = getClientCoachAssignmentStatus(
      client.status,
      client.coach,
    );

    const membership =
      client.expiresAt && client.plan
        ? getMembershipStatus(client.expiresAt)
        : null;

    return {
      ...client,
      contact: client.contact?.trim() || undefined,
      plan: client.plan?.trim() || undefined,
      coach: client.coach?.trim() || null,
      assignedOn: client.assignedOn,
      status: assignmentStatus.label,
      statusTone: assignmentStatus.tone,
      membershipStatus: membership?.label,
      membershipStatusTone: membership?.tone,
    };
  });
}
