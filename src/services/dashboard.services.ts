import {
  COMPANY_CLIENT_ROWS,
  COMPANY_STAFF_ROWS,
} from "@/data/company";
import { COACH_CLIENTS } from "@/data/coach-clients";
import {
  ANNOUNCEMENTS,
  PERSONAL_COACH_MEDICAL_NOTES,
  PERSONAL_COACH_OVERVIEW,
  PERSONAL_COACH_TODAY_SESSIONS,
} from "@/data/personal-coach";
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
// Company overview data

export async function getCompanyStaff() {
  await new Promise((r) => setTimeout(r, 200));
  return COMPANY_STAFF_ROWS.map((staff): CompanyStaffRow => ({ ...staff }));
}

// Personal coach overview data
export async function getPersonalCoachOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return PERSONAL_COACH_OVERVIEW;
}

export async function getPersonalCoachTodaySessions(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...PERSONAL_COACH_TODAY_SESSIONS].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return sorted.slice(0, limit);
}

export async function getPersonalCoachProgressSeries() {
  await new Promise((r) => setTimeout(r, 200));
  return COACH_CLIENTS.filter(
    (
      c,
    ): c is typeof c & {
      progressSeries: NonNullable<typeof c.progressSeries>;
    } => !!c.progressSeries?.points?.length,
  ).map((c) => c.progressSeries!);
}

/** Returns coach clients for My Clients table. Same source as clients page. */
export async function getPersonalCoachClientProgress(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));
  return COACH_CLIENTS.slice(0, limit);
}

export async function getPersonalCoachMedicalNotes(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...PERSONAL_COACH_MEDICAL_NOTES].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return sorted.slice(0, limit);
}

export async function getPersonalCoachAnnouncements(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...ANNOUNCEMENTS].sort(
    (a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime(),
  );

  return sorted.slice(0, limit);
}

// clients assigned to a coach
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
