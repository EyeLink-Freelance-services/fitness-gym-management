import { CompanyClientsTableClient } from "@/components/Dashboard/company/company-clients-table-client";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getRoleFromAuthContext } from "@/config/routes.config";
import {
  getCompanyPricingForCompany,
  getCompanyClients,
} from "@/services/company/company.service";

export default async function CompanyClientsPage() {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);
  const isCoach = role === "company-coach";

  if (isCoach) {
    const clientsResult = await getCompanyClients({
      pageNumber: 0,
      pageSize: 10,
    });

    return (
      <CompanyClientsTableClient
        initialData={clientsResult.clients}
        totalCount={clientsResult.totalCount}
        companyPricing={null}
        coachView
      />
    );
  }

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
