import { CompanyClientsTableClient } from "@/components/Dashboard/company/company-clients-table-client";
import {
  getCompanyPricingForCompany,
  getCompanyClients,
} from "@/services/company/company.service";

export default async function CompanyClientsPage() {
  const [clientsResult, companyPricing] = await Promise.all([
    getCompanyClients({ pageNumber: 0, pageSize: 10 }),
    getCompanyPricingForCompany(),
  ]);

  return (
    <CompanyClientsTableClient
      initialData={clientsResult.clients}
      totalCount={clientsResult.totalCount}
      companyPricing={companyPricing}
    />
  );
}
