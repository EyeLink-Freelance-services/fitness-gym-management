import { CompanyClientCoachAssignTableClient } from "@/components/Dashboard/company/company-client-coach-assign-table-client";
import { getCompanyAllClients } from "@/modules/company/company.service";

export default async function ClientCoachAssignPage() {
  const assignments = await getCompanyAllClients();

  return <CompanyClientCoachAssignTableClient data={assignments} />;
}
