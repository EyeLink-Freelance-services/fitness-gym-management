import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import {
  getCompanyClientFullName,
  getMembershipPlanLabel,
} from "@/modules/company/company-client.mappers";
import type { CompanyClient } from "@/types/dashboard/company";
import { formatProfileDate, getClientInitials, planStatusTone } from "./utils";

type ClientProfileHeaderProps = {
  client: CompanyClient;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ClientProfileHeader({
  client,
  isEditing,
  isPending,
  onEdit,
  onSave,
  onCancel,
}: ClientProfileHeaderProps) {
  const fullName = getCompanyClientFullName(client);
  const initials = getClientInitials(client.firstName, client.lastName);

  return (
    <header className="mb-6 rounded-xl bg-white px-6 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary dark:bg-primary/20">
            {initials}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-dark dark:text-white">
              {fullName}
            </h1>
            <p className="mt-0.5 truncate text-sm text-dark-6">{client.email}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <StatusBadge
                label={getMembershipPlanLabel(client.membershipPlan)}
                tone="primary"
              />
              {client.planStatus && (
                <StatusBadge
                  label={client.planStatus}
                  tone={planStatusTone(client.planStatus)}
                />
              )}
            </div>

            <p className="mt-2 text-xs text-dark-6">
              {client.joinedAt && (
                <span>Member since {formatProfileDate(client.joinedAt)}</span>
              )}
              {client.coachId && (
                <span className={client.joinedAt ? " · " : ""}>
                  Coach: {client.coachId}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <Button
                label={isPending ? "Saving…" : "Save"}
                variant="primary"
                size="small"
                onClick={onSave}
                disabled={isPending}
              />
              <Button
                label="Cancel"
                variant="outlineDark"
                size="small"
                onClick={onCancel}
                disabled={isPending}
              />
            </>
          ) : (
            <Button
              label="Edit"
              variant="outlineDark"
              size="small"
              onClick={onEdit}
            />
          )}
        </div>
      </div>
    </header>
  );
}
