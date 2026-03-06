import { DUMMY_KPIS, EXPIRING_MEMBERSHIPS } from "@/data/company";
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
    (item) => new Date(item.expiresAt) >= now
  );

  const sorted = upcoming.sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
  );

  return sorted.slice(0, limit);
}