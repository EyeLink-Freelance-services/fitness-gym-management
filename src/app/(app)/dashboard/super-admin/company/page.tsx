import { getAllGyms } from "@/services/dashboard.services";
import CompanyTableClient from "@/components/Dashboard/super-admin/company-table-client";

export default async function SuperAdminCompanyPage() {
  const allGyms = await getAllGyms();

  return <CompanyTableClient data={allGyms} />;
}
