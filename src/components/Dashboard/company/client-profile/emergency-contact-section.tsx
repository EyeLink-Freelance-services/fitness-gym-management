import { EditableField, FieldGrid } from "./editable-field";
import { ProfileSection } from "./profile-section";
import type { ClientProfileSectionProps } from "./types";

export function EmergencyContactSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  return (
    <ProfileSection title="Emergency contact">
      <FieldGrid>
        <EditableField
          label="Contact name"
          display={client.emergencyContactName}
          value={draft.emergencyContactName}
          isEditing={isEditing}
          onChange={(v) => onPatch({ emergencyContactName: v })}
        />
        <EditableField
          label="Contact phone"
          display={client.emergencyContactPhone}
          value={draft.emergencyContactPhone}
          isEditing={isEditing}
          type="tel"
          onChange={(v) => onPatch({ emergencyContactPhone: v })}
        />
      </FieldGrid>
    </ProfileSection>
  );
}
