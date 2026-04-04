import { CompanyCoachesTableClient } from "@/components/Dashboard/company/company-coaches-table-client";
import { getCompanyCoaches } from "@/services/dashboard.services";

export default async function CompanyCoachesPage() {
  const coaches = await getCompanyCoaches();

  return <CompanyCoachesTableClient data={coaches} />;
}
