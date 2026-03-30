import type { StatusTone } from "@/types/shared";

export interface CompanyCoachRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string
  specialization: string;
  certifications?: string;
  year_exp?: number;
  bio?: string;
  availability: string;
  email: string;
  phone: string;
  clients?: number;
  status: string;
  created_by?: string;
  updated_by?: string;
}

export interface CompanyClientRow {
  id: string;
  name: string;
  contact?: string;
  plan?: string;
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
