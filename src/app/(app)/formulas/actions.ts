'use server'

import { resolveSchemaMode, SchemaMode } from "@/lib/db/helpers/resolve-schema-mode";
import { getCompanyFormulasQuery, getEffectiveCompanyFormulasQuery, resetCoachFormulaOverrideQuery, saveCoachFormulaOverrideBundleQuery, saveCompanyFormulaBundleQuery } from "@/lib/db/queries/formula-builder";
import { getCompanyFieldGroupsQuery, getEffectiveFieldGroupsQuery } from "@/lib/db/queries/schema-builder";
import { FieldGroup, FormulaDefinition, FullFormulas } from "@/types/dashboard";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/formulas";

export async function saveCompanyFormulasBundleAction(payload: {
  formula: FormulaDefinition;
}) {
  try {
    const data = await saveCompanyFormulaBundleQuery(payload);
    revalidatePath(REVALIDATE_PATH);
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, message: error?.message ?? "failed to save company formula bundle" };
  }
}

export async function saveCoachFormulasOverrideBundleAction(payload: {
  formula: FormulaDefinition;
}) {
  try {
    const data = await saveCoachFormulaOverrideBundleQuery(payload);
    revalidatePath(REVALIDATE_PATH);
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, message: error?.message ?? "failed to save coach schema override bundle" };
  }
}


export async function getGroupsFormulasDataAction() {
  try {
    const { mode, companyId } = await resolveSchemaMode();
    if(companyId != null) {
      const [groups, formulas] = 
        mode === "company_or_personal"
          ? await Promise.all([
            getCompanyFieldGroupsQuery(),
            getCompanyFormulasQuery()
            ])
          : await Promise.all([
            getEffectiveFieldGroupsQuery(companyId),
            getEffectiveCompanyFormulasQuery(companyId)
            ]);
      return {
        ok: true,
        data: {
          mode: mode as SchemaMode,
          groups: groups as FieldGroup[] ?? [],
          formulas: formulas as FormulaDefinition[] ?? []
        } as FullFormulas,
      };
    }
    return {
        ok: false,
        message: 'Company not found, need to reconnect'
      };
    
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to load formulas page data",
    };
  }
}

export async function resetCoachFormulaOverrideAction(formulaId: string) {
  try {
    await resetCoachFormulaOverrideQuery(formulaId);
    revalidatePath(REVALIDATE_PATH);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to reset coach formula override",
    };
  }
}