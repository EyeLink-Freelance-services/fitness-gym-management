import { CompanyFormData } from "@/types/forms";
import { StatusOpt, SuperAdminCompanyRow } from "@/types/dashboard/super-admin";
import { CompanyRepository } from "@/modules/company/company.repository";
import { getServerDbClient } from "@/lib/db/server-client";

export async function createCompanyService(form: CompanyFormData) {
  const db = await getServerDbClient();

  try {
    let logoUrl: string | null = null;
    if (form.companyLogo) {
      logoUrl = await uploadCompanyLogo(form.companyLogo);
    }

    const { data, error } = await db.rpc("create_company_with_branches", {
      p_name: form.companyName,
      p_brn: form.brn,
      p_contact_phone: form.contactNumber,
      p_address: form.addressLine1,
      p_city: form.city,
      p_post_code: form.postcode,
      p_region: form.state,
      p_disclaimer: form.disclaimer,
      p_standard_price: form.standardPrice,
      p_premium_price: form.hasPremiumPlan ? form.premiumPrice : null,
      p_logo_url: logoUrl,
      p_branches: form.branches,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadCompanyLogo(file: File) {
  void file;
  throw new Error("Company logo upload is not configured yet.");
}

export async function findAllCompanies(): Promise<SuperAdminCompanyRow[]> {
  return (await CompanyRepository.findAll()).map(
    (company): SuperAdminCompanyRow => ({
      id: company.id,
      company_name: company.name,
      company_logo: company.logo_url ?? null,
      business_reg_no: company.brn ? `BRN-${company.brn}` : "N/A",
      contact_number: company.contact_phone ?? "",
      address_line_1: company.address ?? "",
      city: company.city ?? "",
      postcode: company.post_code ?? "",
      district: company.region ?? "",
      branches: company.company_branches.map(
        (b: { branch_name: any }) => b.branch_name,
      ),
      standard_price: company.standard_price ?? 0,
      has_premium_plan: company.mode === "premium",
      premium_price: company.premium_price ?? null,
      disclaimer_text: company.disclaimer ?? "",
      terms_and_conditions: company.terms ? "Agreed" : "Not Agreed",
      status: company.deleted_at
        ? ("inactive" as StatusOpt)
        : ("active" as StatusOpt),
      createdAt: company.created_at,
    }),
  );
}

export async function getLastFiveCompanies(): Promise<SuperAdminCompanyRow[]> {
  const companies = await CompanyRepository.findSummary(1, 5);

  return companies.map(
    (company: any): SuperAdminCompanyRow => ({
      id: company.id,
      company_name: company.name,
      business_reg_no: company.brn ? `BRN-${company.brn}` : "N/A",
      contact_number: company.contact_phone ?? "",
      address_line_1: company.address ?? "",
      city: company.city ?? "",
      postcode: company.post_code ?? "",
      district: company.region ?? "",
      branches:
        company.company_branches?.map(
          (b: { branch_name: string }) => b.branch_name,
        ) ?? [],
      standard_price: company.standard_price ?? 0,
      has_premium_plan: company.mode === "premium",
      premium_price: company.premium_price ?? null,
      disclaimer_text: company.disclaimer ?? "",
      terms_and_conditions: company.terms ? "Agreed" : "Not Agreed",
      status: company.deleted_at
        ? ("inactive" as StatusOpt)
        : ("active" as StatusOpt),
      createdAt: company.created_at,
    }),
  );
}
