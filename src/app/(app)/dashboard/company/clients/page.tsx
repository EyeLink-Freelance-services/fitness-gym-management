import { CompanyClientsTableClient } from "@/components/Dashboard/company/company-clients-table-client";
import {
  getCompanyAllClients,
  getCompanyPricingForCompany,
} from "@/modules/company/company.service";

export default async function CompanyClientsPage() {
  const [clients, companyPricing] = await Promise.all([
    getCompanyAllClients(),
    getCompanyPricingForCompany(),
  ]);

  return (
    <CompanyClientsTableClient data={clients} companyPricing={companyPricing} />
  );
}
