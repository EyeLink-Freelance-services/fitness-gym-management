import { CompanyFormData } from "@/types/forms";
import { CompanyResponseApiBean, SearchCompaniesApiBean, StatusOpt, SuperAdminCompanyRow } from "@/types/dashboard/super-admin";
import { backendGet, backendPost } from "@/lib/api/backend-client";

function mapCompanyApiToRow(company: CompanyResponseApiBean): SuperAdminCompanyRow {
  return {
    id: company.id,
    company_name: company.information.companyName,
    company_logo: company.information.logo ?? null,
    business_reg_no: company.information.brn
      ? `BRN-${company.information.brn}`
      : "N/A",
    contact_number: "",
    address_line_1: company.address.street,
    city: company.address.city,
    postcode: company.address.postalCode,
    district: company.address.state,
    branches: (company.information.branches ?? []).map((b) => b.name),
    standard_price: company.price.standardPrice ?? 0,
    has_premium_plan: company.price.hasPremiumPrice ?? false,
    premium_price: company.price.premiumPrice ?? null,
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
  if (form.companyLogo) {
    throw new Error("Company logo upload is not configured yet.");
  }

  return await backendPost("/api/companies", {
    information: {
      companyName: form.companyName,
      brn: form.brn,
      branches: form.branches.map((b) => ({ name: b.branchName })),
    },
    address: {
      street: form.addressLine1,
      city: form.city,
      state: form.state,
      postalCode: form.postcode,
    },
    price: {
      standardPrice: form.standardPrice ?? 0,
      hasPremiumPrice: form.hasPremiumPlan,
      premiumPrice: form.hasPremiumPlan ? (form.premiumPrice ?? null) : null,
    },
    miscellaneous: {
      disclaimer: form.disclaimer,
      agreeTermsOfService: form.agreeTerms,
    },
  });
}

export async function findAllCompanies(): Promise<SuperAdminCompanyRow[]> {
  const data = await backendGet<SearchCompaniesApiBean>(
    "/api/companies?pageNumber=0&pageSize=100&descendingSort=true",
  );
  return (data.companies ?? []).map(mapCompanyApiToRow);
}

export async function getLastFiveCompanies(): Promise<SuperAdminCompanyRow[]> {
  const data = await backendGet<SearchCompaniesApiBean>(
    "/api/companies?pageNumber=0&pageSize=5&descendingSort=true",
  );
  return (data.companies ?? []).map(mapCompanyApiToRow);
}
