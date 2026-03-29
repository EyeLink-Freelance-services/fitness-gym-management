import { FormulaBuilderWorkspace } from "@/components/Dashboard/formula-builder/workspace";
import {
  getCompanyFieldGroups,
  getCompanyFormulas,
} from "@/services/coach-schema.services";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import { getGroupsFormulasDataAction } from "./actions";
import { FullFormulas } from "@/types/dashboard";

function buildSampleValuesFromSchema(groups: FieldGroup[]): Record<string, number> {
  const values: Record<string, number> = {};
  for (const group of groups) {
    for (const field of group.fields) {
      if (field.type === "number" && field.key) {
        const min = field.validation?.min;
        values[field.key] = typeof min === "number" ? min : 0;
      }
      if (
        field.type === "dropdown" &&
        field.key &&
        field.options?.[0]?.value
      ) {
        const v = field.options[0].value;
        const num = Number(v);
        if (!Number.isNaN(num)) values[field.key] = num;
      }
    }
  }
  return values;
}

export default async function FormulaPage() {
  // const [groups, formulas] = await Promise.all([
  //   getCompanyFieldGroups(),
  //   getCompanyFormulas(),
  // ]);
  const res = await getGroupsFormulasDataAction();

  console.log(res, 'res');
  const { groups, formulas, mode } = res.data as FullFormulas;
  const sampleValues = buildSampleValuesFromSchema(groups);

  return (
    <div>
      <FormulaBuilderWorkspace
        mode={mode}
        formulas={formulas}
        fieldGroups={groups}
        sampleValues={sampleValues}
      />
    </div>
  );
}
