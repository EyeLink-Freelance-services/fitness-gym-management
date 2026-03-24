import { emptyToNull } from "../utils";
import { CompanyInsert, CompanyRow, CompanyUpdate } from "../types";
import { CompanyCreateInput, CompanyUpdateInput } from "@/lib/validation/schemas/company";

export function toCompanyInsert(values: CompanyCreateInput): CompanyInsert {
  return {
    name: values.name.trim(),
    mode: values.mode,
    logo_url: emptyToNull(values.logo_url),
    brn: emptyToNull(values.brn),
    address: emptyToNull(values.address),
    city: emptyToNull(values.city),
    post_code: emptyToNull(values.post_code),
    region: emptyToNull(values.region),
    contact_email: emptyToNull(values.contact_email),
    contact_phone: emptyToNull(values.contact_phone),
    terms: emptyToNull(values.terms),
    disclaimer: emptyToNull(values.disclaimer),
  };
}

export function toCompanyUpdate(values: CompanyUpdateInput): CompanyUpdate {
  return {
    id: values.id,
    ...toCompanyInsert(values)
  }
}

export function companyToUpdateInput(company: CompanyRow): CompanyUpdateInput {
  return {
    id: company.id,
    name: company.name ?? "",
    mode: company.mode as "personal" | "company",
    logo_url: company.logo_url ?? "",
    brn: company.brn ?? "",
    address: company.address ?? "",
    city: company.city ?? "",
    post_code: company.post_code ?? "",
    region: company.region ?? "",
    contact_email: company.contact_email ?? "",
    contact_phone: company.contact_phone ?? "",
    terms: company.terms ?? "",
    disclaimer: company.disclaimer ?? "",
  };
}