import type { StatusTone } from "@/types/shared";
import { StatusOpt } from "./super-admin";

export interface CompanyCoachRow {
  id: string;

  first_name: string;
  last_name: string;
  phone_num: string;
  email: string;
  specialization: string;
  coaching_mode: string;
  location: string;
  qualifications: string;
  certifications: string[];
  years_of_experience: number;
  hourly_rate: number;
  languages_spoken: string[];
  bio: string;
  profile_photo?: string | null;
  availability: string[];
  status: StatusOpt;
  createdAt: string;
}

export interface CompanyStaffRow {
  id: string;
  first_name: string;
  last_name: string;
  gym_name: string;
  phone_num: string;
  email: string;
  role: string;
  notes?: string;
  status: StatusOpt;
}

export interface CompanyClientRow {
  id: string;
  name: string;
  contact?: string;
  plan?: string;
  price?: number;
  joinedAt?: string;
  expiresAt?: string;
  coach?: string | null;
  assignedOn?: string;
  /** Coach assignment: Assigned | Pending | Unassigned */
  status?: string;
  statusTone?: StatusTone;
  /** Membership: Active | Expiring | Expired */
  membershipStatus?: string;
  membershipStatusTone?: StatusTone;
}
