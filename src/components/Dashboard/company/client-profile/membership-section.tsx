import { StatusBadge } from "@/components/ui-elements/status-badge";
import { getMembershipPlanLabel } from "@/modules/company/company-client.mappers";
import { MEMBERSHIP_PLAN_FORM_OPTIONS } from "./constants";
import type { ClientProfileSectionProps } from "./types";
import {
  EditableField,
  profileFieldInputClass,
  ReadOnlyField,
} from "./editable-field";
import { ProfileSection } from "./profile-section";
import { formatProfileDate, planStatusTone } from "./utils";

export function MembershipSection({
  client,
  draft,
  isEditing,
  onPatch,
}: ClientProfileSectionProps) {
  const showPersonalFees =
    draft.membershipPlan === "personalCoach" ||
    client.membershipPlan === "PERSONAL";

  return (
    <ProfileSection title="Membership">
      <div className="space-y-5">
        <EditableField
          label="Plan"
          display={getMembershipPlanLabel(client.membershipPlan)}
          value={draft.membershipPlan}
          isEditing={isEditing}
          options={[...MEMBERSHIP_PLAN_FORM_OPTIONS]}
          onChange={(v) => {
            const nextPlan = v as "standard" | "personalCoach";
            onPatch({
              membershipPlan: nextPlan,
              ...(nextPlan === "standard" ? { assignedCoach: "" } : {}),
            });
          }}
        />

        {showPersonalFees && (
          <EditableField
            label="Additional fees (Rs)"
            display={
              client.additionalFees != null ? String(client.additionalFees) : "—"
            }
            value={
              draft.additionalFees != null ? String(draft.additionalFees) : ""
            }
            isEditing={isEditing}
            onChange={(v) =>
              onPatch({
                additionalFees: v !== "" ? Number(v) : undefined,
              })
            }
          />
        )}

        {client.standardPrice != null && (
          <ReadOnlyField
            label="Standard price (Rs)"
            value={client.standardPrice}
          />
        )}

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-dark-6">
            Status
          </p>
          {client.planStatus ? (
            <StatusBadge
              label={client.planStatus}
              tone={planStatusTone(client.planStatus)}
            />
          ) : (
            <p className="text-sm text-dark-6">—</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-dark-6">
              Start date
            </p>
            {isEditing ? (
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => onPatch({ startDate: e.target.value })}
                className={profileFieldInputClass}
              />
            ) : (
              <p className="text-sm font-medium text-dark dark:text-white">
                {formatProfileDate(client.joinedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}
