"use client";

import { FormulaEditor } from "@/components/Dashboard/formula-builder/formula-editor";
import { FormulaList } from "@/components/Dashboard/formula-builder/formula-list";
import { FormulaTestPanel } from "@/components/Dashboard/formula-builder/formula-test-panel";
import { buildVariableReferences } from "@/lib/formula/variable-utils";
import { validateFormulaExpression } from "@/lib/formula/preview-engine";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { useEffect, useMemo, useState } from "react";

type FormulaBuilderWorkspaceProps = {
  formulas: FormulaDefinition[];
  fieldGroups: FieldGroup[];
  sampleValues: Record<string, number>;
};

export function FormulaBuilderWorkspace({
  formulas,
  fieldGroups,
  sampleValues,
}: FormulaBuilderWorkspaceProps) {
  const [selectedFormulaId, setSelectedFormulaId] = useState(
    formulas[0]?.id ?? "",
  );
  const selectedFormula =
    formulas.find((formula) => formula.id === selectedFormulaId) ?? formulas[0];
  const [expression, setExpression] = useState(
    selectedFormula?.expression ?? "",
  );

  useEffect(() => {
    if (selectedFormula) {
      setExpression(selectedFormula.expression);
    }
  }, [selectedFormula]);

  const variableReferences = useMemo(
    () =>
      buildVariableReferences(
        fieldGroups.flatMap((group) => group.fields),
        formulas,
      ),
    [fieldGroups, formulas],
  );

  const validation = useMemo(() => {
    if (!selectedFormula) {
      return {
        valid: false,
        detectedVariables: [],
        unknownVariables: [],
        circularDependencies: [],
        error: "Select a formula.",
      };
    }

    return validateFormulaExpression(
      expression,
      variableReferences.map((item) => item.key),
      formulas.map((formula) => ({
        key: formula.key,
        expression:
          formula.id === selectedFormula.id ? expression : formula.expression,
      })),
      sampleValues,
    );
  }, [expression, formulas, sampleValues, selectedFormula, variableReferences]);

  if (!selectedFormula) {
    return null;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)_280px]">
      <FormulaList
        formulas={formulas}
        selectedFormulaId={selectedFormula.id}
        onSelect={setSelectedFormulaId}
      />

      <FormulaEditor
        formula={selectedFormula}
        expression={expression}
        onExpressionChange={setExpression}
        validation={validation}
      />

      <div className="grid gap-6">
        <FormulaTestPanel
          formula={selectedFormula}
          expression={expression}
          formulas={formulas.map((formula) =>
            formula.id === selectedFormula.id
              ? { ...formula, expression }
              : formula,
          )}
          sampleValues={sampleValues}
          variableReferences={variableReferences}
        />
      </div>
    </div>
  );
}
