import { MedicalConditionsField } from "./editable-field";
import { ProfileSection } from "./profile-section";
import type { ClientProfileSectionProps } from "./types";

export function MedicalSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  return (
    <ProfileSection title="Medical">
      <MedicalConditionsField
        label="Medical conditions"
        display={client.medicalConditions ?? ""}
        value={draft.medicalConditions ?? ""}
        isEditing={isEditing}
        onChange={(v) => onPatch({ medicalConditions: v })}
      />
    </ProfileSection>
  );
}
