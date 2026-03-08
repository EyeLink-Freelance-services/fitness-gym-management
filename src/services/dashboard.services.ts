import {
  DUMMY_KPIS,
  GYM_CLIENTS,
} from "@/data/company";
import {
  COMPANY_ANNOUNCEMENT_FILTERS,
  COMPANY_ANNOUNCEMENT_OVERVIEW,
  COMPANY_ANNOUNCEMENTS,
} from "@/data/company-announcement";
import { COMPANY_ANNOUNCEMENT_METRICS } from "@/data/company-announcement-metrics";
import {
  COMPANY_MEMBERSHIP_DISTRIBUTION,
  COMPANY_MEMBERSHIP_OVERVIEW,
  COMPANY_MEMBERSHIP_PLANS,
  COMPANY_MEMBERSHIP_PROMOTIONS,
  COMPANY_MEMBERSHIP_REVENUE,
} from "@/data/company-membership";
import type { PaymentCollectionsTimeFrame } from "@/types/dashboard/payment";
import type { MembershipRevenueTimeFrame } from "@/types/dashboard/membership";
import {
  COMPANY_PAYMENT_ALERT,
  COMPANY_PAYMENT_COLLECTIONS,
  COMPANY_PAYMENT_OVERVIEW,
  COMPANY_PAYMENT_RENEWALS,
  COMPANY_PAYMENT_TRANSACTIONS,
} from "@/data/company-payment";
import {
  DUMMY_COACHES,
  DUMMY_GYMS,
  OVERVIEW_SUPER_ADMIN_DATA,
} from "@/data/superAdmin";
import { buildCompanyClientRows } from "@/utils/dashboard/company-client-rows";

const COMPANY_CLIENT_ROWS = buildCompanyClientRows(GYM_CLIENTS);

// Gyms
export async function getAllGyms() {
  // const res = await fetch("/api/gyms");
  // return res.json();

  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_GYMS;
}

export async function getTopGyms(limit = 5) {
  // const res = await fetch(`/api/gyms?limit=${limit}`);
  // return res.json();

  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...DUMMY_GYMS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return sorted.slice(0, limit);
}

// Coaches
export async function getAllCoaches() {
  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_COACHES;
}

export async function getTopCoaches(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...DUMMY_COACHES].sort((a, b) => b.clients - a.clients);

  return sorted.slice(0, limit);
}

// Super Admin overview data
export async function getSuperAdminOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return OVERVIEW_SUPER_ADMIN_DATA;
}

// Company overview data
export async function getCompanyOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_KPIS;
}

// get 5 latest gyms membership which is expiring soon
export async function getExpiringSoonGyms(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const now = new Date();

  const upcoming = COMPANY_CLIENT_ROWS.filter(
    (item) => item.expiresAt && new Date(item.expiresAt) >= now,
  );

  const sorted = upcoming.sort(
    (a, b) =>
      new Date(a.expiresAt ?? 0).getTime() - new Date(b.expiresAt ?? 0).getTime(),
  );

  return sorted.slice(0, limit);
}

// Recent 5 gym clients who are assigned to a coach
export async function getGymCoachCLientAssign(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...COMPANY_CLIENT_ROWS]
    .filter((client) => client.coach || client.status || client.assignedOn)
    .sort(
      (a, b) =>
        new Date(b.assignedOn ?? 0).getTime() -
        new Date(a.assignedOn ?? 0).getTime(),
    );

  return sorted.slice(0, limit);
}

// Recent 5 new gym clients
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

export async function getCompanyAnnouncementOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_ANNOUNCEMENT_OVERVIEW;
}

export async function getCompanyAnnouncements() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_ANNOUNCEMENTS;
}

export async function getCompanyAnnouncementFilters() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_ANNOUNCEMENT_FILTERS;
}

export async function getCompanyAnnouncementMetrics() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_ANNOUNCEMENT_METRICS;
}
