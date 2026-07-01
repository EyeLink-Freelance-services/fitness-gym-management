import { notFound } from "next/navigation";
import { CompanyDataEntry } from "@/components/Dashboard/company/data-entry";
import { ClientDataEntryBreadcrumb } from "@/components/Dashboard/company/client-profile/client-data-entry-breadcrumb";
import { getMetricFormulas } from "@/services/company/metric-formula.service";
import { getCompanyClientMetricValueDraft } from "@/services/company/client-metric-value.service";
import { assertCoachCanAccessClient } from "@/lib/auth/coach-client-access";

type PageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientDataEntryPage({ params }: PageProps) {
  const { clientId } = await params;

  await assertCoachCanAccessClient(clientId);

  const [metricData, formulas] = await Promise.all([
    getCompanyClientMetricValueDraft(clientId),
    getMetricFormulas(),
  ]);

  if (!metricData) {
    notFound();
  }

  const { draft, metricValues } = metricData;

  return (
    <div>
      <ClientDataEntryBreadcrumb
        clientId={clientId}
        clientName={draft.clientName}
      />
      <CompanyDataEntry
        draft={draft}
        formulas={formulas}
        metricValues={metricValues}
      />
    </div>
  );
}
