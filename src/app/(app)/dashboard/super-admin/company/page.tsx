import CompanyTableClient from "@/components/Dashboard/super-admin/company-table-client";
import { findAllCompanies } from "@/modules/company/company.service";

export default async function SuperAdminCompanyPage() {
  const allCompanies = await findAllCompanies();

  return <CompanyTableClient data={allCompanies} />;
}
