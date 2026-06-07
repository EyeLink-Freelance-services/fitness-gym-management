import { CompanyCoachesTableClient } from "@/components/Dashboard/company/company-coaches-table-client";
import { getCompanyCoaches } from "@/services/company/company.service";

export default async function CompanyCoachesPage() {
  const { coaches, totalCount } = await getCompanyCoaches({
    pageNumber: 0,
    pageSize: 10,
  });

  return (
    <CompanyCoachesTableClient initialData={coaches} totalCount={totalCount} />
  );
}
