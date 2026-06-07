"use client";

import { CoachSearchSelect } from "@/components/FormElements/CoachSearchSelect";
import { getClientCoachDisplayName } from "@/modules/company/company-client.mappers";
import { ProfileSection } from "./profile-section";
import type { ClientProfileSectionProps } from "./types";
import { formatProfileDate } from "./utils";

export function CoachSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  const showCoachAssignment =
    draft.membershipPlan === "personalCoach" ||
    client.membershipPlan === "PERSONAL";

  const coachName = getClientCoachDisplayName(client);

  if (!showCoachAssignment) {
    return null;
  }

  return (
    <ProfileSection title="Assigned coach">
      {!isEditing && client.coachId ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
            {coachName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-dark dark:text-white">
              {coachName}
            </p>
            {client.assignedOn && (
              <p className="text-xs text-dark-6">
                Since {formatProfileDate(client.assignedOn)}
              </p>
            )}
          </div>
        </div>
      ) : !isEditing ? (
        <p className="text-sm text-dark-6">No coach assigned.</p>
      ) : (
        <CoachSearchSelect
          label="Coach"
          placeholder="Search coach by name, email, or phone..."
          value={draft.assignedCoach ?? ""}
          selectedCoachLabel={client.coachName ?? undefined}
          onChange={(value) => onPatch({ assignedCoach: value })}
        />
      )}
    </ProfileSection>
  );
}
