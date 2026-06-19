import { CompanyDataEntry } from "@/components/Dashboard/company/data-entry";
import {
  getCompanyFormulas,
  getCompanyRecordDraft,
} from "@/services/coach-schema.services";

type PageProps = {
  searchParams: Promise<{ clientId?: string }>;
};

export default async function CompanyDataEntryPage({
  searchParams,
}: PageProps) {
  const { clientId } = await searchParams;
  const [draft, formulas] = await Promise.all([
    getCompanyRecordDraft(clientId),
    getCompanyFormulas(),
  ]);

  return <CompanyDataEntry draft={draft} formulas={formulas} />;
}
