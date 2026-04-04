import { CompanyClientCoachAssignTableClient } from "@/components/Dashboard/company/company-client-coach-assign-table-client";
import { getCompanyClients } from "@/services/dashboard.services";

export default async function ClientCoachAssignPage() {
  const assignments = await getCompanyClients();

  return <CompanyClientCoachAssignTableClient data={assignments} />;
}
