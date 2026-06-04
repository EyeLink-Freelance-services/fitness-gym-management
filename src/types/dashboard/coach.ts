import type { AuditableApiBean } from "./shared";

// ---------------------------------------------------------------------------
// Coach enums – exact values from OpenAPI spec.
// ---------------------------------------------------------------------------

/** Coaching mode – matches CoachingModeApiBean. */
export type CoachingMode = "IN_PERSON" | "ONLINE" | "HYBRID";

/** Coach availability – matches CoachAvailabilityApiBean. */
export type CoachAvailability =
  | "WEEKDAYS"
  | "WEEKEND"
  | "WEEKDAYS_WEEKEND"
  | "FLEXIBLE";

/** Sort fields for coach search – matches CoachSearchSortFieldApiBean. */
export type CoachSearchSortField =
  | "FIRST_NAME"
  | "LAST_NAME"
  | "EMAIL"
  | "CONTACT_NUMBER"
  | "COACHING_MODE"
  | "AVAILABILITY"
  | "HOURLY_RATE"
  | "CREATION_DATE";

// ---------------------------------------------------------------------------
// Coach API DTOs – direct mapping to/from the OpenAPI spec.
// ---------------------------------------------------------------------------

export interface CoachInformationApiBean {
  firstName?: string;
  lastName?: string;
  picture?: string;
  location?: string;
}

export interface CoachContactApiBean {
  email?: string;
  contactNumber?: string;
}

export interface CoachDetailsApiBean {
  coachingMode?: CoachingMode;
  availability?: CoachAvailability;
  yearsOfExperience?: number;
  spokenLanguages?: string;
  biography?: string;
  hourlyRate?: number;
  certifications?: string;
}

/** Request body for create / update coach operations. */
export interface CoachRequestApiBean {
  information?: CoachInformationApiBean;
  contact?: CoachContactApiBean;
  details?: CoachDetailsApiBean;
}

/** Response body returned by GET /companies/{companyId}/coaches/{coachId}. */
export interface CoachResponseApiBean {
  id: string;
  companyId?: string;
  information?: CoachInformationApiBean;
  contact?: CoachContactApiBean;
  details?: CoachDetailsApiBean;
  auditData?: AuditableApiBean;
  version?: number;
}

/** Paginated response from GET /companies/{companyId}/coaches. */
export interface SearchCoachesApiBean {
  coaches?: CoachResponseApiBean[];
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  totalPages?: number;
}
