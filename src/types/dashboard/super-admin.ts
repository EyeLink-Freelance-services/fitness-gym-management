export type StatusOpt = "Active" | "Inactive" | "Disabled" | "Pending";

export interface SuperAdminCoachesRow {
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
  availability: string;
  status: StatusOpt;
  createdAt: string;
}

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


interface CompanyBranchApiBean {
  id?: string;
  name: string;
}

export interface CompanyResponseApiBean {
  id: string;
  information: {
    companyName: string;
    email: string;
    logo?: string | null;
    brn: string;
    contactNumber?: string;
    branches: CompanyBranchApiBean[];
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  price: {
    standardPrice: number;
    additionalFees: number;
  };
  miscellaneous: {
    disclaimer: string;
    agreeTermsOfService: boolean;
  };
  auditData?: {
    createdDate?: string;
    createdBy?: string;
    lastModifiedDate?: string;
    lastModifiedBy?: string;
  };
}

export interface SearchCompaniesApiBean {
  companies: CompanyResponseApiBean[];
  pageSize: number;
  pageNumber: number;
  totalElements: number;
  totalPages: number;
}

