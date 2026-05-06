import type { StatusTone } from "@/types/shared";
import { StatusOpt } from "./super-admin";

export interface CompanyCoachesRow {
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


export interface AuditableApiBean {
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface ClientInformationApiBean {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
}

export interface ClientContactApiBean {
  email?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ClientFullPlanApiBean {
  id?: string;
  membershipPlan?: "NORMAL" | "PERSONAL" | string;
  additionalFees?: number;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED" | string;
  startDate?: string;
  endDate?: string;
  auditData?: AuditableApiBean;
  version?: number;
}

export interface ClientResponseApiBean {
  id: string;
  companyId?: string;
  userId?: string;
  information?: ClientInformationApiBean;
  contact?: ClientContactApiBean;
  activePlan?: ClientFullPlanApiBean;
  medicalConditions?: string;
  agreeTermsOfService?: boolean;
  auditData?: AuditableApiBean;
  version?: number;
}

export interface SearchClientsApiBean {
  clients?: ClientResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}