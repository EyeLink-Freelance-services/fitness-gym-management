import { notFound, redirect } from "next/navigation";
import { fetchCompanyClientRecordDraftAction } from "@/app/(app)/dashboard/company/clients/client-data-entry-actions";
import { CompanyDataEntry } from "@/components/Dashboard/company/data-entry";
import { ROUTES } from "@/constants/route";
import { getCompanyFormulas } from "@/services/coach-schema.services";

type PageProps = {
  searchParams: Promise<{ clientId?: string }>;
};

export default async function CompanyDataEntryPage({
  searchParams,
}: PageProps) {
  const { clientId } = await searchParams;

  if (!clientId) {
    redirect(ROUTES.DASHBOARD.COMPANY.CLIENTS);
  }

  const [draft, formulas] = await Promise.all([
    fetchCompanyClientRecordDraftAction(clientId),
    getCompanyFormulas(),
  ]);

  if (!draft) {
    notFound();
  }

  return (
    <CompanyDataEntry
      clientId={clientId}
      draft={draft}
      formulas={formulas}
    />
  );
}
