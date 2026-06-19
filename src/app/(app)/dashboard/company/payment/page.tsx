import { CompanyPaymentsTableClient } from "@/components/Dashboard/company/company-payments-table-client";
import { getCurrentBillingMonth } from "@/modules/company/company-payment.mappers";
import { getCompanyPayments } from "@/services/company/company-payment.service";

export default async function CompanyPaymentPage() {
  const billingMonth = getCurrentBillingMonth();
  const { payments, totalCount } = await getCompanyPayments({
    pageNumber: 0,
    pageSize: 10,
    billingMonth,
  });

  return (
    <CompanyPaymentsTableClient
      initialData={payments}
      totalCount={totalCount}
      billingMonth={billingMonth}
    />
  );
}
