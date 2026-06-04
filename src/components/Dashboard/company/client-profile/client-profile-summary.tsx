import { cn } from "@/lib/utils";
import {
  getClientDisplayFee,
  getMembershipPlanLabel,
} from "@/modules/company/company-client.mappers";
import type { CompanyClient, CompanyPricing } from "@/types/dashboard/company";
import { formatProfileDate, membershipDuration } from "./utils";

function SummaryCard({
  label,
  value,
  sub,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border-0 bg-gray-50 p-5 shadow-1 dark:border dark:border-gray-7/50 dark:bg-gray-dark">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-dark-6">
        {label}
      </p>
      <p
        className={cn(
          "truncate text-base font-bold text-dark dark:text-white",
          valueClassName,
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-dark-6">{sub}</p>}
    </div>
  );
}

export function ClientProfileSummary({
  client,
  companyPricing,
}: {
  client: CompanyClient;
  companyPricing: CompanyPricing | null;
}) {
  const fee = getClientDisplayFee(client, companyPricing ?? undefined);

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <SummaryCard
        label="Plan"
        value={getMembershipPlanLabel(client.membershipPlan)}
        sub={client.planStatus}
        valueClassName={
          client.membershipPlan === "PERSONAL" ? "text-primary" : undefined
        }
      />
      <SummaryCard
        label="Monthly fee"
        value={fee != null ? `Rs ${fee}` : "—"}
      />
      <SummaryCard
        label="Member since"
        value={formatProfileDate(client.joinedAt)}
        sub={
          client.joinedAt
            ? `${membershipDuration(client.joinedAt)} total`
            : undefined
        }
      />
      <SummaryCard
        label="Coach"
        value={client.coachId ?? "Unassigned"}
        sub={
          client.assignedOn
            ? `Since ${formatProfileDate(client.assignedOn)}`
            : undefined
        }
        valueClassName={client.coachId ? "text-green" : "text-dark-6"}
      />
    </div>
  );
}
