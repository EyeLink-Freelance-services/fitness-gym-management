import CompanyTableClient from "@/components/Dashboard/super-admin/company-table-client";
import { getCompanies } from "@/modules/super-admin/super-admin.service";

export default async function SuperAdminCompanyPage() {
  const { companies, totalCount } = await getCompanies({ pageNumber: 0, pageSize: 10 });

  return <CompanyTableClient initialData={companies} totalCount={totalCount} />;
}
