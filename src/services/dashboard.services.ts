import {
  COMPANY_CLIENT_ROWS,
  COMPANY_STAFF_ROWS,
} from "@/data/company";
import {
  COMPANY_MEMBERSHIP_DISTRIBUTION,
  COMPANY_MEMBERSHIP_OVERVIEW,
  COMPANY_MEMBERSHIP_PLANS,
  COMPANY_MEMBERSHIP_PROMOTIONS,
  COMPANY_MEMBERSHIP_REVENUE,
} from "@/data/company-membership";
import type { CompanyStaffRow } from "@/types/dashboard/company";
import type { PaymentCollectionsTimeFrame } from "@/types/dashboard/payment";
import type { MembershipRevenueTimeFrame } from "@/types/dashboard/membership";
import {
  COMPANY_PAYMENT_ALERT,
  COMPANY_PAYMENT_COLLECTIONS,
  COMPANY_PAYMENT_OVERVIEW,
  COMPANY_PAYMENT_RENEWALS,
  COMPANY_PAYMENT_TRANSACTIONS,
} from "@/data/company-payment";

export async function getCompanyStaff() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_STAFF_ROWS.map((staff): CompanyStaffRow => ({ ...staff }));
}

export async function getGymCoachCLientAssign(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...COMPANY_CLIENT_ROWS]
    .filter((client) => client.coachId || client.status || client.assignedOn)
    .sort(
      (a, b) =>
        new Date(b.assignedOn ?? 0).getTime() -
        new Date(a.assignedOn ?? 0).getTime(),
    );

  return sorted.slice(0, limit);
}

export async function getGymNewClient(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...COMPANY_CLIENT_ROWS].sort(
    (a, b) =>
      new Date(b.joinedAt ?? 0).getTime() - new Date(a.joinedAt ?? 0).getTime(),
  );

  return sorted.slice(0, limit);
}

export async function getCompanyPaymentOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_PAYMENT_OVERVIEW;
}

export async function getCompanyPaymentAlert() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_PAYMENT_ALERT;
}

export async function getCompanyPaymentCollections(
  timeFrame: PaymentCollectionsTimeFrame | string = "last 6 months",
) {
  await new Promise((r) => setTimeout(r, 200));

  if (timeFrame === "last 12 months") {
    return COMPANY_PAYMENT_COLLECTIONS["last 12 months"];
  }

  return COMPANY_PAYMENT_COLLECTIONS["last 6 months"];
}

export async function getCompanyPaymentTransactions(limit?: number) {
  await new Promise((r) => setTimeout(r, 200));

  if (!limit) {
    return COMPANY_PAYMENT_TRANSACTIONS;
  }

  return COMPANY_PAYMENT_TRANSACTIONS.slice(0, limit);
}

export async function getCompanyPaymentRenewals(limit?: number) {
  await new Promise((r) => setTimeout(r, 200));

  if (!limit) {
    return COMPANY_PAYMENT_RENEWALS;
  }

  return COMPANY_PAYMENT_RENEWALS.slice(0, limit);
}

export async function getCompanyMembershipOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_MEMBERSHIP_OVERVIEW;
}

export async function getCompanyMembershipPlans() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_MEMBERSHIP_PLANS;
}

export async function getCompanyMembershipRevenue(
  timeFrame: MembershipRevenueTimeFrame | string = "this month",
) {
  await new Promise((r) => setTimeout(r, 200));

  if (timeFrame === "this quarter") {
    return COMPANY_MEMBERSHIP_REVENUE["this quarter"];
  }

  return COMPANY_MEMBERSHIP_REVENUE["this month"];
}

export async function getCompanyMembershipDistribution(
  timeFrame: MembershipRevenueTimeFrame | string = "this month",
) {
  await new Promise((r) => setTimeout(r, 200));

  if (timeFrame === "this quarter") {
    return COMPANY_MEMBERSHIP_DISTRIBUTION["this quarter"];
  }

  return COMPANY_MEMBERSHIP_DISTRIBUTION["this month"];
}

export async function getCompanyMembershipPromotions() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_MEMBERSHIP_PROMOTIONS;
}

export async function getCompanyAnnouncements(limit = 4) {
  const { getRecentNotices } = await import(
    "@/services/company/notice.service"
  );
  const { mapNoticeToCardItem } = await import(
    "@/types/dashboard/announcement"
  );

  const notices = await getRecentNotices(limit);
  return notices.map(mapNoticeToCardItem);
}
