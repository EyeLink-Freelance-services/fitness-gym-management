import type { StatusTone } from "@/types/shared";
import type { SuperAdminCompanyRow } from "./super-admin";
import type { AuditableApiBean, Gender, MembershipPlan } from "./shared";

// ---------------------------------------------------------------------------
// Company Coach UI row (displayed in the company coaches table).
// ---------------------------------------------------------------------------

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
  status: import("./super-admin").StatusOpt;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Company Staff UI row.
// ---------------------------------------------------------------------------

export interface CompanyStaffRow {
  id: string;
  first_name: string;
  last_name: string;
  gym_name: string;
  phone_num: string;
  email: string;
  role: string;
  notes?: string;
  status: import("./super-admin").StatusOpt;
}

// ---------------------------------------------------------------------------
// Membership plan – two representations.
// ---------------------------------------------------------------------------

/** API / domain membership plan (backend enum values). */
export type MembershipPlanKind = MembershipPlan;

/** Form select values for membership plan. */
export type MembershipPlanFormValue = "standard" | "personalCoach";

// ---------------------------------------------------------------------------
// Company Client – single source of truth for the company dashboard.
// Used for: list display, edit form seed data, API response mapping.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Company Pricing – used when displaying / computing client fees.
// ---------------------------------------------------------------------------

export type CompanyPricing = {
  standardPrice: number | undefined;
  additionalFees: number | null | undefined;
};

// ---------------------------------------------------------------------------
// Component prop interfaces.
// ---------------------------------------------------------------------------

export interface CompanyClientsTableClientProps {
  initialData: CompanyClient[];
  totalCount: number;
  companyPricing: CompanyPricing | null;
}

// CompanyTableClientProps lives in super-admin.ts (it references SuperAdminCompanyRow).
export type { SuperAdminCompanyRow };

// ---------------------------------------------------------------------------
// Client API DTOs – direct mapping to/from the OpenAPI spec.
// ---------------------------------------------------------------------------

export interface ClientInformationApiBean {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface ClientContactApiBean {
  email?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface ClientPlanApiBean {
  membershipPlan?: MembershipPlan;
  additionalFees?: number;
}

export interface ClientFullPlanApiBean {
  id?: string;
  membershipPlan?: MembershipPlan | string;
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
  plan?: ClientFullPlanApiBean;
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
