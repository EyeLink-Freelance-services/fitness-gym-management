import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import {
  getPersonalCoachFormulas,
  getPersonalCoachRecordDraft,
} from "@/services/coach-schema.services";

export default async function PersonalCoachDataEntryPage() {
  const [draft, formulas] = await Promise.all([
    getPersonalCoachRecordDraft(),
    getPersonalCoachFormulas(),
  ]);

  return (
    <div>
      <DataEntryWorkspace draft={draft} formulas={formulas} />
    </div>
  );
}
