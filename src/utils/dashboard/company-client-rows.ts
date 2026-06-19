import type { CompanyClient } from "@/types/dashboard/company";
import type { StatusTone } from "@/types/shared";
import { getMembershipStatus } from "@/utils/dashboard/company-directory";

export function getClientCoachAssignmentStatus(
  status: CompanyClient["status"],
  coachId: CompanyClient["coachId"],
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

  if (!coachId) {
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
  clients: CompanyClient[],
): CompanyClient[] {
  return clients.map((client) => {
    const assignmentStatus = getClientCoachAssignmentStatus(
      client.status,
      client.coachId,
    );

    const membership = client.expiresAt
      ? getMembershipStatus(client.expiresAt)
      : null;

    return {
      ...client,
      coachId: client.coachId?.trim() || null,
      assignedOn: client.assignedOn,
      status: assignmentStatus.label,
      statusTone: assignmentStatus.tone,
      membershipStatus: membership?.label,
      membershipStatusTone: membership?.tone,
    };
  });
}
