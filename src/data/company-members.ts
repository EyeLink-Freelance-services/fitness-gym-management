import { GYM_CLIENTS } from "@/data/company";
import type { CompanyMemberRow } from "@/types/dashboard/company-directory";
import { getMembershipStatus } from "@/utils/dashboard/company-directory";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";

const companyClientRows = buildCompanyClientRows(GYM_CLIENTS);

export const COMPANY_MEMBER_ROWS: CompanyMemberRow[] = companyClientRows
  .filter(
    (client): client is typeof client & { plan: string; expiresAt: string } =>
      Boolean(client.plan && client.expiresAt),
  )
  .map((client) => {
    const membershipStatus = getMembershipStatus(client.expiresAt);

    return {
      id: client.id,
      name: client.name,
      plan: client.plan,
      expiresAt: client.expiresAt,
      status: membershipStatus.label,
      statusTone: membershipStatus.tone,
    };
  });
