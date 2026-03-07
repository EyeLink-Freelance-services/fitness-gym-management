import {
  COACH_ASSIGNMENTS,
  DUMMY_KPIS,
  EXPIRING_MEMBERSHIPS,
  NEW_GYM_CLIENTS,
} from "@/data/company";
import type { PaymentCollectionsTimeFrame } from "@/types/dashboard/payment";
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

  const upcoming = EXPIRING_MEMBERSHIPS.filter(
    (item) => new Date(item.expiresAt) >= now,
  );

  const sorted = upcoming.sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
  );

  return sorted.slice(0, limit);
}

// Recent 5 gym clients who are assigned to a coach
export async function getGymCoachCLientAssign(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...COACH_ASSIGNMENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return sorted.slice(0, limit);
}

// Recent 5 new gym clients
export async function getGymNewClient(limit = 5) {
  await new Promise((r) => setTimeout(r, 200));

  const sorted = [...NEW_GYM_CLIENTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
