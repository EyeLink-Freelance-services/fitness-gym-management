import MemberActions from "@/app/(app)/clients/components/ui";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { Member } from "@/types/member";

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString();
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stroke/70 bg-white/70 p-4 shadow-sm dark:border-dark-3 dark:bg-white/5">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-dark dark:text-white">
        {value}
      </p>
    </div>
  );
}

export default function PersonalInfo(props: Member) {
  const fullName = `${props.first_name ?? ""} ${props.last_name ?? ""}`.trim();

  return (
    <div>
      <ShowcaseSection className="overflow-hidden !p-0">
        <div className="border-b border-stroke/70 bg-gradient-to-r from-white to-slate-50 px-6 py-6 dark:border-dark-3 dark:from-dark-2 dark:to-dark">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                {props.first_name?.[0]}
                {props.last_name?.[0]}
              </div>

              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-semibold text-dark dark:text-white">
                    {fullName || "Unnamed member"}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={props.status ?? "Unknown"}
                      tone={props.status === "active" ? "success" : "neutral"}
                    />

                    {props.member_code ? (
                      <span className="rounded-full border border-stroke bg-white px-3 py-1 text-xs font-medium text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                        Code: {props.member_code}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {formatDate(props.created_at)}
                </p>
              </div>
            </div>

            <div className="lg:min-w-[240px]">
              <div className="rounded-2xl border border-stroke/70 bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-dark-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </p>
                <MemberActions id={props.id} member={props} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InfoItem label="Email" value={props.email ?? "-"} />
            <InfoItem label="Phone" value={props.phone ?? "-"} />
            <InfoItem label="Birth Date" value={formatDate(props.dob)} />
            <InfoItem label="Gender" value={props.gender ?? "-"} />
            <InfoItem label="Address" value={props.address ?? "-"} />
            <InfoItem
              label="Emergency Contact Phone"
              value={props.emergency_contact_phone ?? "-"}
            />
            <InfoItem
              label="Emergency Contact Name"
              value={props.emergency_contact_name ?? "-"}
            />
            <InfoItem
              label="Assigned Coach"
              value={props.assigned_coach_id ?? "-"}
            />
          </div>
        </div>
      </ShowcaseSection>
    </div>
  );
}