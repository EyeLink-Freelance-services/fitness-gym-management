"use client";

import { FormulaEditor } from "@/components/Dashboard/formula-builder/formula-editor";
import { FormulaList } from "@/components/Dashboard/formula-builder/formula-list";
import { FormulaTestPanel } from "@/components/Dashboard/formula-builder/formula-test-panel";
import { VersionHistory } from "@/components/Dashboard/formula-builder/version-history";
import { buildVariableReferences } from "@/lib/formula/variable-utils";
import { validateFormulaExpression } from "@/lib/formula/preview-engine";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type {
  FormulaDefinition,
  FormulaVersionSummary,
} from "@/types/dashboard/formula-builder";
import { useEffect, useMemo, useState } from "react";

type FormulaBuilderWorkspaceProps = {
  formulas: FormulaDefinition[];
  versions: FormulaVersionSummary[];
  fieldGroups: FieldGroup[];
  sampleValues: Record<string, number>;
};

export function FormulaBuilderWorkspace({
  formulas,
  versions,
  fieldGroups,
  sampleValues,
}: FormulaBuilderWorkspaceProps) {
  const [selectedFormulaId, setSelectedFormulaId] = useState(formulas[0]?.id ?? "");
  const selectedFormula =
    formulas.find((formula) => formula.id === selectedFormulaId) ?? formulas[0];
  const [expression, setExpression] = useState(selectedFormula?.expression ?? "");

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
        expression: formula.id === selectedFormula.id ? expression : formula.expression,
      })),
      sampleValues,
    );
  }, [expression, formulas, sampleValues, selectedFormula, variableReferences]);

  if (!selectedFormula) {
    return null;
  }

  const evaluationOrder = formulas.map((formula) => ({
    key: formula.key,
    dependsOn: formula.dependencies,
  }));

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
        knownVariables={variableReferences.map((item) => item.key)}
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
        />
        <VersionHistory
          versions={versions.filter(
            (version) => version.formulaId === selectedFormula.id,
          )}
        />
        <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-5">
            Eval Order
          </h3>
          <div className="mt-4 grid gap-2 text-sm">
            {evaluationOrder.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <span className="font-medium text-primary">{item.key}</span>
                <span className="text-[11px] text-dark-5">
                  {item.dependsOn.length ? item.dependsOn.join(", ") : "no deps"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
