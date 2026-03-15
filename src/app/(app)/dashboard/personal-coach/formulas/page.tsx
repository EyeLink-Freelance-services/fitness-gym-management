import { FormulaBuilderWorkspace } from "@/components/Dashboard/formula-builder/workspace";
import {
  getPersonalCoachFieldGroups,
  getPersonalCoachFormulas,
  getPersonalCoachRecordDraft,
} from "@/services/coach-schema.services";

export default async function PersonalCoachFormulaPage() {
  const [groups, formulas, draft] = await Promise.all([
    getPersonalCoachFieldGroups(),
    getPersonalCoachFormulas(),
    getPersonalCoachRecordDraft(),
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
