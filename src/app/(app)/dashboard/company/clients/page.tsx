import { CompanyClientsTableClient } from "@/components/Dashboard/company/company-clients-table-client";
import { getCompanyClients } from "@/services/dashboard.services";

export default async function CompanyClientsPage() {
  const clients = await getCompanyClients();

  return <CompanyClientsTableClient data={clients} />;
}
