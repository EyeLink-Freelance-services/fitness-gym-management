import { CompanyFormData } from "@/types/forms";
import {
  CompanyResponseApiBean,
  SearchCompaniesApiBean,
  StatusOpt,
  SuperAdminCompanyRow,
} from "@/types/dashboard/super-admin";
import { backendGet, backendPost, backendPut } from "@/lib/api/backend-client";
import { applyContactSearchParams } from "@/lib/api/apply-search-params";
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
    branches: (company.information.branches ?? []).map(
      (b) => b.branchName ?? b.name ?? "",
    ),
    standard_price: company.price.standardPrice ?? 0,
    disclaimer_text: company.miscellaneous.disclaimer ?? "",
    terms_and_conditions: company.miscellaneous.agreeTermsOfService
      ? "Agreed"
      : "Not Agreed",
    status: "Active" as StatusOpt,
    createdAt: company.auditData?.createdDate ?? "",
  };
}

const COMPANY_API_BASE = "/api/companies";

export async function createCompanyService(form: CompanyFormData) {
  return await backendPost(
    COMPANY_API_BASE,
    mapCompanyFormToCompanyRequest(form),
  );
}

export async function getCompanies({
  pageNumber = 0,
  pageSize = 10,
  search,
}: GetPageParams & { search?: string } = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    descendingSort: "true",
  });

  applyContactSearchParams(params, search, "companyName");

  const data = await backendGet<SearchCompaniesApiBean>(
    `${COMPANY_API_BASE}?${params.toString()}`,
  );

  return {
    companies: (data.companies ?? []).map(mapCompanyApiToRow),
    totalCount: data.totalElements ?? 0,
  };
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
