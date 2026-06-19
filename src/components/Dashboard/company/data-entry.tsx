import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import type { ClientRecordDraft } from "@/types/dashboard/client-records";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";

type CompanyDataEntryProps = {
  draft: ClientRecordDraft;
  formulas: FormulaDefinition[];
};

export function CompanyDataEntry({ draft, formulas }: CompanyDataEntryProps) {
  return (
    <div>
      <DataEntryWorkspace draft={draft} formulas={formulas} />
    </div>
  );
}
