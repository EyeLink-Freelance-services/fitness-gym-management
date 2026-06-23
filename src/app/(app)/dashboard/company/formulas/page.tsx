import { FormulaBuilderWorkspace } from "@/components/Dashboard/formula-builder/workspace";
import { getClientMetricDefinitionFieldGroups } from "@/services/company/client-metric-definition.service";
import { getMetricFormulas } from "@/services/company/metric-formula.service";

export default async function CompanyFormulaPage() {
  const [groups, formulas] = await Promise.all([
    getClientMetricDefinitionFieldGroups(),
    getMetricFormulas(),
  ]);

  return (
    <div>
      <FormulaBuilderWorkspace formulas={formulas} fieldGroups={groups} />
    </div>
  );
}
