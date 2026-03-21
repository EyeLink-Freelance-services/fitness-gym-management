import {
  CLIENT_BODY_COMPOSITION,
  CLIENT_BODY_MEASUREMENTS,
  CLIENT_COACH_SUMMARY,
  CLIENT_MEAL_PLAN,
  CLIENT_MEMBERSHIP_SUMMARY,
  CLIENT_OVERVIEW,
  CLIENT_PAYMENT_HISTORY,
  CLIENT_UPCOMING_SESSIONS,
  CLIENT_WEIGHT_TREND,
  CLIENT_WORKOUT_PLAN,
} from "@/data/client";
import { COMPANY_CLIENT_ROWS, DUMMY_KPIS } from "@/data/company";
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
import type {
  StatusOpt,
  SuperAdminCompanyRow,
} from "@/types/dashboard/super-admin";
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
// Gyms
export async function getAllGyms(){
  // const res = await fetch("/api/gyms");
  // return res.json();

  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_GYMS.map((gym) => ({
    id: String(gym.id),
    company_name: gym.name,
    company_logo: gym.logo,
    business_reg_no: `BRN-${gym.id}`,
    contact_number: "+1 555-000-0000",
    address_line_1: gym.location,
    city: "",
    postcode: "",
    district: "",
    branches: [],
    disclaimer_text: "",
    terms_and_conditions: "",
  }));
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

  return DUMMY_COACHES.map((coach, i) => ({
    id: `coach-${i + 1}`,
    first_name: coach.name.split(" ")[0] ?? coach.name,
    last_name: coach.name.split(" ").slice(1).join(" ") || "—",
    phone_num: "+1 555-000-0000",
    email: `${coach.name.toLowerCase().replace(/\s/g, ".")}@example.com`,
    specialization: coach.specialization,
    location: coach.location,
    qualifications: "Certified",
    certifications: ["ACE-CPT"],
    years_of_experience: 5,
    hourly_rate: 75,
    languages_spoken: ["English"],
    bio: "",
    profile_photo: coach.logo,
    availability: ["Mon", "Wed", "Fri"],
    clients: coach.clients,
    statusTone: (coach.status === "Active" ? "Active" : "Not Active") as StatusOpt,
  }));
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

/** Returns clients with progress series for the chart. New clients (no progress) are excluded. */
export async function getPersonalCoachProgressSeries() {
  await new Promise((r) => setTimeout(r, 200));
  return COACH_CLIENTS.filter(
    (c): c is typeof c & { progressSeries: NonNullable<typeof c.progressSeries> } =>
      !!c.progressSeries?.points?.length,
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

// Client dashboard
export async function getClientOverviewData() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_OVERVIEW;
}

export async function getClientMembershipSummary() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_MEMBERSHIP_SUMMARY;
}

export async function getClientCoachSummary() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_COACH_SUMMARY;
}

export async function getClientWeightTrend() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_WEIGHT_TREND;
}

export async function getClientBodyComposition() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_BODY_COMPOSITION;
}

export async function getClientUpcomingSessions(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...CLIENT_UPCOMING_SESSIONS].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return sorted.slice(0, limit);
}

export async function getClientBodyMeasurements() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_BODY_MEASUREMENTS;
}

export async function getClientWorkoutPlan() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_WORKOUT_PLAN;
}

export async function getClientMealPlan() {
  await new Promise((r) => setTimeout(r, 200));
  return CLIENT_MEAL_PLAN;
}

export async function getClientPaymentHistory(limit?: number) {
  await new Promise((r) => setTimeout(r, 200));

  if (!limit) {
    return CLIENT_PAYMENT_HISTORY;
  }

  return CLIENT_PAYMENT_HISTORY.slice(0, limit);
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
      new Date(a.expiresAt ?? 0).getTime() -
      new Date(b.expiresAt ?? 0).getTime(),
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
