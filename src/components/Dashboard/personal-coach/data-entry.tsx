import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import type { ClientRecordDraft } from "@/types/dashboard/client-records";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type PersonalCoachDataEntryProps = {
  draft: ClientRecordDraft;
  formulas: FormulaDefinition[];
};

export function PersonalCoachDataEntry({ draft, formulas }: PersonalCoachDataEntryProps) {
  return (
    <div>
      <DataEntryWorkspace draft={draft} formulas={formulas} />
    </div>
  );
}
