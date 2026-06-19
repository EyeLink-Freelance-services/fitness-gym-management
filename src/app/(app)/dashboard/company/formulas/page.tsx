import { FormulaBuilderWorkspace } from "@/components/Dashboard/formula-builder/workspace";
import {
  getCompanyFieldGroups,
  getCompanyFormulas,
  getCompanyRecordDraft,
} from "@/services/coach-schema.services";

export default async function CompanyFormulaPage() {
  const [groups, formulas, draft] = await Promise.all([
    getCompanyFieldGroups(),
    getCompanyFormulas(),
    getCompanyRecordDraft(),
  ]);

  const previewValues = Object.fromEntries(
    Object.entries(draft.values)
      .map(([key, value]) => [key, Number(value)])
      .filter(([, value]) => !Number.isNaN(value)),
  );

  return (
    <div>
      <FormulaBuilderWorkspace
        formulas={formulas}
        fieldGroups={groups}
        sampleValues={previewValues}
      />
    </div>
  );
}
