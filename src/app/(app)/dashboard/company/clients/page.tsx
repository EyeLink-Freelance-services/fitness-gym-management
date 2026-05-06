import { CompanyClientsTableClient } from "@/components/Dashboard/company/company-clients-table-client";
import { getCompanyAllClients } from "@/modules/company/company.service";

export default async function CompanyClientsPage() {
  const clients = await getCompanyAllClients();

  return <CompanyClientsTableClient data={clients} />;
}
