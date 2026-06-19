import type { AuditableApiBean } from "./shared";

// ---------------------------------------------------------------------------
// Status union – used across super-admin and company UI rows.
// ---------------------------------------------------------------------------

export type StatusOpt = "Active" | "Inactive" | "Disabled" | "Pending";

// ---------------------------------------------------------------------------
// Super Admin UI rows – flat, denormalised shapes used by table components.
// ---------------------------------------------------------------------------

export interface SuperAdminCompanyRow {
  id: string;
  company_name: string;
  company_logo?: string | null;
  email: string;
  business_reg_no: string;
  contact_number: string;
  address_line_1: string;
  city: string;
  postcode: string;
  district: string;
  branches: string[];
  standard_price: number;
  disclaimer_text: string;
  terms_and_conditions: string;
  status: StatusOpt;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Company API DTOs – direct mapping to/from the OpenAPI spec.
// ---------------------------------------------------------------------------

/** Branch as returned by the backend. Swagger field: branchName. */
export interface CompanyBranchApiBean {
  id?: string;
  /** NOTE: backend currently serialises this as `name` (not `branchName` per spec). */
  name: string;
}

export interface CompanyInformationApiBean {
  companyName: string;
  logo?: string | null;
  brn: string;
  email: string;
  contactNumber?: string;
  branches: CompanyBranchApiBean[];
}

export interface CompanyAddressApiBean {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CompanyPriceApiBean {
  standardPrice: number;
  additionalFees?: number;
}

export interface CompanyMiscellaneousApiBean {
  disclaimer: string;
  agreeTermsOfService: boolean;
}

export interface CompanyResponseApiBean {
  id: string;
  information: CompanyInformationApiBean;
  address: CompanyAddressApiBean;
  price: CompanyPriceApiBean;
  miscellaneous: CompanyMiscellaneousApiBean;
  auditData?: AuditableApiBean;
  version?: number;
}

export interface SearchCompaniesApiBean {
  companies: CompanyResponseApiBean[];
  pageSize: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Component prop interfaces.
// ---------------------------------------------------------------------------

export interface CompanyTableClientProps {
  initialData: SuperAdminCompanyRow[];
  totalCount: number;
}
