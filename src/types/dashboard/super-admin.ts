export type StatusOpt = "Active" | "Not Active";

export interface SuperAdminCoachesRow {
  id: string;

  // Basic identity
  first_name: string;
  last_name: string;

  // Contact
  phone_num: string;
  email: string;

  // Profile
  specialization: string;
  location: string;
  qualifications: string;
  certifications: string[];
  years_of_experience: number;
  hourly_rate: number;
  languages_spoken: string[];
  bio: string;

  // Media
  profile_photo?: string | null;

  // Availability
  availability: string[];

  // System fields
  clients: number;
  statusTone: StatusOpt;
}

export interface SuperAdminCompanyRow {
  id: string;
  // Basic Info
  company_name: string;
  company_logo?: string | null;

  // Registration
  business_reg_no: string;

  // Contact
  contact_number: string;

  // Location
  address_line_1: string;
  city: string;
  postcode: string;
  district: string;

  // Branches
  branches: string[];

  // Legal
  disclaimer_text: string;
  terms_and_conditions: string;
}
