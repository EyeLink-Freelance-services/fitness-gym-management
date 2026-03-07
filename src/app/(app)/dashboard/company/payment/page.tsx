import { DashboardSection } from "@/components/Dashboard/dashboard-section";
import { OverviewCard } from "@/components/Dashboard/overview-cards/card";
import { PaymentAlert } from "@/components/Dashboard/payment/payment-alert";
import { PaymentCollectionsChart } from "@/components/Dashboard/payment/payment-collections-chart";
import { PaymentRenewalsTable } from "@/components/Dashboard/payment/payment-renewals-table";
import { PaymentTransactionsTable } from "@/components/Dashboard/payment/payment-transactions-table";
import { PeriodPicker } from "@/components/period-picker";
import { COMPANY_PAYMENT_TABLE_FILTERS } from "@/data/company-payment";
import {
  getCompanyPaymentAlert,
  getCompanyPaymentCollections,
  getCompanyPaymentOverviewData,
  getCompanyPaymentRenewals,
  getCompanyPaymentTransactions,
} from "@/services/dashboard.services";
import { SearchType } from "@/types/dashboard";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

export default async function CompanyPaymentPage({ searchParams }: SearchType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const selectedCollectionsTimeFrame =
    extractTimeFrame("payment_collections")?.split(":")[1] || "last 6 months";

  const [overviewCards, paymentAlert, collections, transactions, renewals] =
    await Promise.all([
      getCompanyPaymentOverviewData(),
      getCompanyPaymentAlert(),
      getCompanyPaymentCollections(selectedCollectionsTimeFrame),
      getCompanyPaymentTransactions(),
      getCompanyPaymentRenewals(),
    ]);

  return (
    <div>
      <DashboardSection title="Payments Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((item) => (
            <div key={item.label} className="space-y-1">
              <OverviewCard
                label={item.label}
                data={{
                  value: item.value,
                  growthRate: item.trend,
                }}
                Icon={item.Icon}
              />
              <p className="px-2 text-sm text-dark-6 dark:text-dark-5">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </DashboardSection>

      <PaymentAlert alert={paymentAlert} />

      <div className="mb-8 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <section className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                Monthly Collections
              </h2>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
                Collected vs expected payments, with overdue exposure.
              </p>
            </div>

            <PeriodPicker
              defaultValue={selectedCollectionsTimeFrame}
              items={["last 6 months", "last 12 months"]}
              sectionKey="payment_collections"
            />
          </div>

          <PaymentCollectionsChart data={collections} />
        </section>
      </div>

      <div className="mb-8">
        <PaymentTransactionsTable
          rows={transactions}
          filters={COMPANY_PAYMENT_TABLE_FILTERS}
        />
      </div>

      <PaymentRenewalsTable rows={renewals} />
    </div>
  );
}
