import { CLIENT_GENDER_OPTIONS } from "./constants";
import { EditableField, FieldGrid } from "./editable-field";
import { ProfileSection } from "./profile-section";
import type { ClientProfileSectionProps } from "./types";
import { formatGender, formatProfileDate } from "./utils";

export function PersonalInfoSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  return (
    <ProfileSection title="Personal information">
      <FieldGrid>
        <EditableField
          label="First name"
          display={client.firstName}
          value={draft.firstName}
          isEditing={isEditing}
          onChange={(v) => onPatch({ firstName: v })}
        />
        <EditableField
          label="Last name"
          display={client.lastName}
          value={draft.lastName}
          isEditing={isEditing}
          onChange={(v) => onPatch({ lastName: v })}
        />
        <EditableField
          label="Email"
          display={client.email}
          value={draft.email}
          isEditing={isEditing}
          type="email"
          onChange={(v) => onPatch({ email: v })}
        />
        <EditableField
          label="Phone"
          display={client.phoneNumber}
          value={draft.phoneNumber}
          isEditing={isEditing}
          type="tel"
          onChange={(v) => onPatch({ phoneNumber: v })}
        />
        <EditableField
          label="Date of birth"
          display={formatProfileDate(client.dateOfBirth)}
          value={draft.dateOfBirth}
          isEditing={isEditing}
          type="date"
          onChange={(v) => onPatch({ dateOfBirth: v })}
        />
        <EditableField
          label="Gender"
          display={formatGender(client.gender)}
          value={draft.gender}
          isEditing={isEditing}
          options={CLIENT_GENDER_OPTIONS}
          onChange={(v) => onPatch({ gender: v })}
        />
      </FieldGrid>
    </ProfileSection>
  );
}
