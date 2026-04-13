import { getAllGyms, getCompanies } from "@/services/dashboard.services";
import CompanyTableClient from "@/components/Dashboard/super-admin/company-table-client";

export default async function SuperAdminCompanyPage() {
  const allCompanies = await getCompanies();

  return <CompanyTableClient data={allCompanies} />;
}
