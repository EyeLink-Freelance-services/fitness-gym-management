import type { StatusTone } from "@/types/shared";
import { StatusOpt, SuperAdminCompanyRow } from "./super-admin";
import { GenderOption } from "./shared";

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

/** API / domain membership plan (backend values). */
export type MembershipPlanKind = "NORMAL" | "PERSONAL";

/** Form select values for membership plan. */
export type MembershipPlanFormValue = "standard" | "personalCoach";

/**
 * Single source of truth for company-dashboard client data
 * (list, edit, create, and API mapping).
 */
export interface CompanyClient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  agreeTermsOfService?: boolean;
  membershipPlan: MembershipPlanKind;
  additionalFees?: number;
  standardPrice?: number;
  coachId?: string | null;
  planStatus?: string;
  joinedAt?: string;
  expiresAt?: string;
  /** Coach assignment */
  assignedOn?: string;
  status?: string;
  statusTone?: StatusTone;
  membershipStatus?: string;
  membershipStatusTone?: StatusTone;
}

/** Form state for create / edit client (company dashboard). */
export interface CompanyClientFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  membershipPlan: MembershipPlanFormValue;
  additionalFees?: number;
  assignedCoach?: string;
  startDate: string;
  agreeTermsOfService?: boolean;
}

export type CompanyClientRow = CompanyClient;


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
  gender?: GenderOption;
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
  coachId?: string;
  standardPrice?: number;
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

export type CompanyPricing = {
  standardPrice: number | undefined;
  additionalFees: number | null | undefined;
};

export interface CompanyClientsTableClientProps {
  initialData: CompanyClient[];
  totalCount: number;
  companyPricing: CompanyPricing | null;
}

export interface CompanyTableClientProps {
  initialData: SuperAdminCompanyRow[];
  totalCount: number;
}