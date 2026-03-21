import type { StatusTone } from "@/types/shared";

export interface CompanyCoachRow {
  id: string;
  name: string;
  email: string;
  clients: number;
  status: string;
  statusTone: StatusTone;
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
