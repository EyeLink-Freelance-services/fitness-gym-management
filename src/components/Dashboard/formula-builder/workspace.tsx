"use client";

import {
  createMetricFormulaAction,
  deleteMetricFormulaAction,
  updateMetricFormulaAction,
} from "@/app/(app)/dashboard/company/formulas/actions";
import { FormulaEditor } from "@/components/Dashboard/formula-builder/formula-editor";
import { FormulaExpressionPicker } from "@/components/Dashboard/formula-builder/formula-expression-picker";
import { FormulaList } from "@/components/Dashboard/formula-builder/formula-list";
import { buildVariableReferences } from "@/lib/formula/variable-utils";
import { validateFormulaExpression } from "@/lib/formula/preview-engine";
import { resolveDefinitionIds } from "@/modules/company/metric-formula.mappers";
import type { FieldGroup } from "@/types/dashboard/coach-schema";
import type { FormulaDefinition } from "@/types/dashboard/formula-builder";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type FormulaBuilderWorkspaceProps = {
  formulas: FormulaDefinition[];
  fieldGroups: FieldGroup[];
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
}: FormulaBuilderWorkspaceProps) {
  const router = useRouter();
  const [selectedFormulaId, setSelectedFormulaId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const selectedFormula = formulas.find(
    (formula) => formula.id === selectedFormulaId,
  );
  const [formula, setFormula] = useState<FormulaDefinition>(emptyFormula);
  const [prevSelectedFormulaId, setPrevSelectedFormulaId] =
    useState(selectedFormulaId);
  const [prevFormulas, setPrevFormulas] = useState(formulas);

  if (
    selectedFormulaId !== prevSelectedFormulaId ||
    formulas !== prevFormulas
  ) {
    setPrevSelectedFormulaId(selectedFormulaId);
    setPrevFormulas(formulas);
    const fromList = formulas.find((f) => f.id === selectedFormulaId);
    setFormula(fromList ? { ...fromList } : emptyFormula());
  }

  const onFormulaChange = useCallback((patch: Partial<FormulaDefinition>) => {
    setFormula((current) => ({ ...current, ...patch }));
  }, []);

  const fields = useMemo(
    () => fieldGroups.flatMap((group) => group.fields),
    [fieldGroups],
  );

  const variableReferences = useMemo(
    () => buildVariableReferences(fields, formulas),
    [fields, formulas],
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
    );
  }, [formula.expression, formulas, selectedFormula, variableReferences]);

  const handleSave = async () => {
    if (!formula.label?.trim()) {
      toast.error("Label is required");
      return;
    }

    if (!formula.expression?.trim()) {
      toast.error("Expression is required");
      return;
    }

    if (!validation.valid) {
      toast.error(validation.error ?? "Fix expression errors before saving");
      return;
    }

    if (resolveDefinitionIds(formula.expression ?? "", fields).length === 0) {
      toast.error("Expression must reference at least one schema field.");
      return;
    }

    setIsSaving(true);

    const result =
      selectedFormulaId && selectedFormula
        ? await updateMetricFormulaAction(selectedFormulaId, formula, fields)
        : await createMetricFormulaAction(formula, formulas, fields);

    setIsSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(
      selectedFormulaId ? "Formula updated successfully" : "Formula created successfully",
    );
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selectedFormulaId) {
      return;
    }

    setIsSaving(true);
    const result = await deleteMetricFormulaAction(selectedFormulaId);
    setIsSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Formula deleted successfully");
    setSelectedFormulaId("");
    router.refresh();
  };

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
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={isSaving}
        validation={validation}
      />

      <FormulaExpressionPicker
        fields={fields}
        expression={formula.expression}
        onExpressionChange={(expression) => onFormulaChange({ expression })}
      />
    </div>
  );
}
