import { FormulaBuilderWorkspace } from "@/components/Dashboard/formula-builder/workspace";
import {
  getCompanyFieldGroups,
  getCompanyFormulaVersions,
  getCompanyFormulas,
} from "@/services/coach-schema.services";

const companyPreviewValues = {
  weight: 74.2,
  height: 172,
  age: 32,
  chest_mm: 12,
  abdominal_mm: 18,
  quad_mm: 16,
  activity_multiplier: 1.55,
};

export default async function CompanyFormulaPage() {
  const [groups, formulas, versions] = await Promise.all([
    getCompanyFieldGroups(),
    getCompanyFormulas(),
    getCompanyFormulaVersions(),
  ]);

  return (
    <div>
      <FormulaBuilderWorkspace
        formulas={formulas}
        versions={versions}
        fieldGroups={groups}
        sampleValues={companyPreviewValues}
      />
    </div>
  );
}
