// ---------------------------------------------------------------------------
// Shared primitive types used across company, client, and coach domains.
// ---------------------------------------------------------------------------

/** Pagination request parameters for backend API calls. */
export type GetPageParams = {
  pageNumber?: number;
  pageSize?: number;
};

/** Generic paginated API response wrapper. */
export interface PaginatedApiResponse<T> {
  pageSize: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
  items: T[];
}

// ---------------------------------------------------------------------------
// Shared API bean: audit metadata returned on every entity response.
// ---------------------------------------------------------------------------

export interface AuditableApiBean {
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

// ---------------------------------------------------------------------------
// Shared API enums (exact values from OpenAPI spec).
// ---------------------------------------------------------------------------

/** Gender enum – matches GenderApiBean in the OpenAPI spec. */
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

/**
 * @deprecated Use Gender instead.
 * Kept for backward-compatibility while downstream files are migrated.
 */
export type GenderOption = Gender;

/** Membership plan enum – matches MembershipPlanApiBean in the OpenAPI spec. */
export type MembershipPlan = "NORMAL" | "PERSONAL";

/** Company sort field enum – matches CompanySearchSortFieldApiBean. */
export type CompanySearchSortField =
  | "COMPANY_NAME"
  | "BRN"
  | "EMAIL"
  | "CONTACT_NUMBER"
  | "CREATION_DATE";

/** Client sort field enum – matches ClientSearchSortFieldApiBean. */
export type ClientSearchSortField =
  | "FIRST_NAME"
  | "LAST_NAME"
  | "DATE_OF_BIRTH"
  | "EMAIL"
  | "GENDER"
  | "EMERGENCY_CONTACT_NAME"
  | "MEMBERSHIP_PLAN"
  | "MEMBERSHIP_PLAN_START_DATE"
  | "CREATION_DATE";
