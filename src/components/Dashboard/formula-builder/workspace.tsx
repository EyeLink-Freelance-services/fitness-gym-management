"use client";

import { FormulaEditor } from "@/components/Dashboard/formula-builder/formula-editor";
import { FormulaList } from "@/components/Dashboard/formula-builder/formula-list";
import { FormulaTestPanel } from "@/components/Dashboard/formula-builder/formula-test-panel";
import { buildVariableReferences } from "@/lib/formula/variable-utils";
import { validateFormulaExpression } from "@/lib/formula/preview-engine";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FormulaBuilderWorkspaceProps = {
  formulas: FormulaDefinition[];
  fieldGroups: FieldGroup[];
  sampleValues: Record<string, number>;
};

function emptyFormula(): FormulaDefinition {
  return {
    id: "",
    label: "",
    key: "",
    expression: "",
    description: "",
  };
}

export function FormulaBuilderWorkspace({
  formulas,
  fieldGroups,
  sampleValues,
}: FormulaBuilderWorkspaceProps) {
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const selectedFormula = formulas.find(
    (formula) => formula.id === selectedFormulaId,
  );
  const [formula, setFormula] = useState<FormulaDefinition>(emptyFormula);
  const lastLoadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastLoadedIdRef.current === selectedFormulaId) return;
    lastLoadedIdRef.current = selectedFormulaId;
    const fromList = formulas.find((f) => f.id === selectedFormulaId);
    if (fromList) setFormula({ ...fromList });
    else setFormula(emptyFormula());
  }, [selectedFormulaId, formulas]);

  const onFormulaChange = useCallback((patch: Partial<FormulaDefinition>) => {
    setFormula((current) => ({ ...current, ...patch }));
  }, []);

  const variableReferences = useMemo(
    () =>
      buildVariableReferences(
        fieldGroups.flatMap((group) => group.fields),
        formulas,
      ),
    [fieldGroups, formulas],
  );

  const validation = useMemo(() => {
    return validateFormulaExpression(
      formula.expression,
      variableReferences.map((item) => item.key),
      formulas.map((f) => ({
        key: f.key,
        expression:
          selectedFormula && f.id === selectedFormula.id
            ? formula.expression
            : f.expression,
      })),
      sampleValues,
    );
  }, [
    formula.expression,
    formulas,
    sampleValues,
    selectedFormula,
    variableReferences,
  ]);

  const formulasForPreview = useMemo(
    () =>
      formulas.map((f) =>
        selectedFormula && f.id === selectedFormula.id ? { ...formula } : f,
      ),
    [formula, formulas, selectedFormula],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)_280px]">
      <FormulaList
        formulas={formulas}
        selectedFormulaId={selectedFormulaId}
        onSelect={setSelectedFormulaId}
        onNewFormula={() => setSelectedFormulaId("")}
      />

      <FormulaEditor
        formula={formula}
        isNew={!selectedFormulaId}
        onFormulaChange={onFormulaChange}
        onSave={() => {
          console.log(formula);
        }}
        validation={validation}
      />

      <div className="grid gap-6">
        <FormulaTestPanel
          formula={formula}
          expression={formula.expression}
          formulas={formulasForPreview}
          sampleValues={sampleValues}
          variableReferences={variableReferences}
        />
      </div>
    </div>
  );
}
