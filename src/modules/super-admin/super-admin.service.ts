import { CompanyFormData } from "@/types/forms";
import {
  CompanyResponseApiBean,
  SearchCompaniesApiBean,
  StatusOpt,
  SuperAdminCompanyRow,
} from "@/types/dashboard/super-admin";
import { backendGet, backendPost, backendPut } from "@/lib/api/backend-client";
import { GetPageParams } from "@/types/dashboard/shared";

function mapCompanyFormToCompanyRequest(form: CompanyFormData) {
  const trimmedEmail = (form.email ?? "").trim();
  const trimmedDisclaimer = (form.disclaimer ?? "").trim();

  if (!trimmedEmail) {
    throw new Error("Company email is required and cannot be empty");
  }

  return {
    information: {
      companyName: form.companyName,
      logo: form.logo ?? null,
      email: trimmedEmail,
      brn: form.brn,
      contactNumber: form.contactNumber,
      branches: form.branches.map((b) => ({ branchName: b.branchName })),
    },
    address: {
      street: form.addressLine1,
      city: form.city,
      state: form.state,
      postalCode: form.postcode,
    },
    price: {
      standardPrice: form.standardPrice ?? 0,
      hasPersonalCoachingPrice: form.hasPersonalCoachingPrice,
      personalCoachingPrice: form.hasPersonalCoachingPrice ? (form.personalCoachingPrice ?? null) : null,
    },
    miscellaneous: {
      disclaimer: trimmedDisclaimer || "N/A",
      agreeTermsOfService: form.agreeTerms,
    },
  };
}

function mapCompanyApiToRow(
  company: CompanyResponseApiBean,
): SuperAdminCompanyRow {
  return {
    id: company.id,
    company_name: company.information.companyName,
    company_logo: company.information.logo ?? null,
    business_reg_no: company.information.brn
      ? `BRN-${company.information.brn}`
      : "N/A",
    contact_number: company.information.contactNumber ?? "",
    email: company.information.email,
    address_line_1: company.address.street,
    city: company.address.city,
    postcode: company.address.postalCode,
    district: company.address.state,
    branches: (company.information.branches ?? []).map((b) => b.name),
    standard_price: company.price.standardPrice ?? 0,
    has_personal_coaching_price: company.price.hasPersonalCoachingPrice ?? false,
    personal_coaching_price: company.price.personalCoachingPrice ?? null,
    disclaimer_text: company.miscellaneous.disclaimer ?? "",
    terms_and_conditions: company.miscellaneous.agreeTermsOfService
      ? "Agreed"
      : "Not Agreed",
    status: "Active" as StatusOpt,
    createdAt: company.auditData?.createdDate ?? "",
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function createCompanyService(form: CompanyFormData) {
  return await backendPost(
    "/api/companies",
    mapCompanyFormToCompanyRequest(form),
  );
}

const COMPANY_API_BASE = "/api/companies";

export async function getCompanies({
  pageNumber = 0,
  pageSize = 10,
}: GetPageParams = {}) {
  const data = await backendGet<SearchCompaniesApiBean>(
    `${COMPANY_API_BASE}?pageNumber=${pageNumber}&pageSize=${pageSize}&descendingSort=true`,
  );

  return {
    companies: (data.companies ?? []).map(mapCompanyApiToRow),
    totalCount: data.totalElements ?? 0,
  };
}

export async function getAllCompanies() {
  const { companies } = await getCompanies({ pageSize: 10 });
  return companies;
}

export async function getLastFiveCompanies() {
  const { companies } = await getCompanies({ pageSize: 5 });
  return companies;
}

export async function updateCompanyService(
  companyId: string,
  form: CompanyFormData,
) {
  return await backendPut(
    `${COMPANY_API_BASE}/${companyId}`,
    mapCompanyFormToCompanyRequest(form),
  );
}
