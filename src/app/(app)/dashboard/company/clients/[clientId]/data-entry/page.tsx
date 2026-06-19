import { notFound } from "next/navigation";
import { CompanyDataEntry } from "@/components/Dashboard/company/data-entry";
import { ClientDataEntryBreadcrumb } from "@/components/Dashboard/company/client-profile/client-data-entry-breadcrumb";
import { getCompanyFormulas } from "@/services/coach-schema.services";
import { getCompanyClientMetricValueDraft } from "@/services/company/client-metric-value.service";

type PageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientDataEntryPage({ params }: PageProps) {
  const { clientId } = await params;

  const [draft, formulas] = await Promise.all([
    getCompanyClientMetricValueDraft(clientId),
    getCompanyFormulas(),
  ]);

  if (!draft) {
    notFound();
  }

  return (
    <div>
      <ClientDataEntryBreadcrumb
        clientId={clientId}
        clientName={draft.clientName}
      />
      <CompanyDataEntry draft={draft} formulas={formulas} />
    </div>
  );
}
