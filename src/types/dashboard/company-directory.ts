import type { StatusTone } from "@/types/shared";

export interface CompanyMemberRow {
  id: string;
  name: string;
  plan: string;
  expiresAt: string;
  status: string;
  statusTone: StatusTone;
}

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
  contact: string;
  plan: string;
  joinedAt: string;
}
