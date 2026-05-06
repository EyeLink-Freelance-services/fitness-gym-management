import CompanyTableClient from "@/components/Dashboard/super-admin/company-table-client";
import { getAllCompanies } from "@/modules/super-admin/super-admin.service";

export default async function SuperAdminCompanyPage() {
  const allCompanies = await getAllCompanies();

  return <CompanyTableClient data={allCompanies} />;
}
