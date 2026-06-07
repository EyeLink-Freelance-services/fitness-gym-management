import { CompanyFormData } from "@/types/forms";

export const DEFAULT_COMPANY_FORM_VALUES: CompanyFormData = {
  companyName: "",
  brn: "",
  email: "",
  contactNumber: "",
  addressLine1: "",
  city: "",
  postcode: "",
  state: "",
  branches: [],
  standardPrice: undefined,
  disclaimer: "N/A",
  agreeTerms: true,
};