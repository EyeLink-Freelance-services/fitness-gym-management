import { EditableField } from "./editable-field";
import { ProfileSection } from "./profile-section";
import type { ClientProfileSectionProps } from "./types";
import { formatProfileDate } from "./utils";

export function CoachSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  return (
    <ProfileSection title="Assigned coach">
      {client.coachId && !isEditing ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
            CO
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-dark dark:text-white">
              {client.coachId}
            </p>
            {client.assignedOn && (
              <p className="text-xs text-dark-6">
                Since {formatProfileDate(client.assignedOn)}
              </p>
            )}
          </div>
        </div>
      ) : !client.coachId && !isEditing ? (
        <p className="text-sm text-dark-6">No coach assigned.</p>
      ) : null}

      {isEditing && (
        <EditableField
          label="Coach ID"
          display={client.coachId ?? ""}
          value={draft.assignedCoach ?? ""}
          isEditing
          onChange={(v) => onPatch({ assignedCoach: v })}
        />
      )}
    </ProfileSection>
  );
}
