import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import {
  getCompanyFormulas,
  getCompanyRecordDraft,
} from "@/services/coach-schema.services";

export default async function CompanyDataEntryPage() {
  const [draft, formulas] = await Promise.all([
    getCompanyRecordDraft(),
    getCompanyFormulas(),
  ]);

  return (
    <div>
      <DataEntryWorkspace draft={draft} formulas={formulas} />
    </div>
  );
}
