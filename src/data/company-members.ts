import { EXPIRING_MEMBERSHIPS } from "@/data/company";
import type { CompanyMemberRow } from "@/types/dashboard/company-directory";
import { getMembershipStatus } from "@/utils/dashboard/company-directory";

export const COMPANY_MEMBER_ROWS: CompanyMemberRow[] = EXPIRING_MEMBERSHIPS.map(
  (member, index) => {
    const membershipStatus = getMembershipStatus(member.expiresAt);

    return {
      id: `member-${index + 1}`,
      name: member.member,
      plan: member.plan,
      expiresAt: member.expiresAt,
      status: membershipStatus.label,
      statusTone: membershipStatus.tone,
    };
  },
);
