import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { supabaseServer } from "@/lib/supabase/server";
import { FormulaDefinition } from "@/types/dashboard";

const TABLES = {
  formulas: "formulas",
  coachFormulaOverrides: "coach_formulas_overrides",
} as const;

export type SaveCompanyFormulaInput = {
  id?: string;
  label: string;
  key: string;
  expression: string;
  unit?: string | null;
  decimals?: number;
  description?: string | null;
  show_portal?: boolean;
  archived?: boolean;
};

export type SaveCoachFormulaOverrideInput = {
  formula_id: string;
  label?: string | null;
  expression?: string | null;
  unit?: string | null;
  decimals?: number | null;
  description?: string | null;
  show_portal?: boolean | null;
  archived?: boolean | null;
};

export async function saveCoachFormulaOverrideBundleQuery(payload: {
	formula: FormulaDefinition;
}) {
	const auth = await requirePermission(AuthPermission.formulaBuilder.edit);
	const supabase = await supabaseServer();

	const { data, error } = await supabase.rpc("save_coach_formula_override_bundle", {
		p_payload: {
      company_id: auth.companyId,
      formula: {
        id: payload.formula.id,
        label: payload.formula.label,
        key: payload.formula.key,
        expression: payload.formula.expression,
        unit: payload.formula.unit ?? null,
        decimals: payload.formula.decimals ?? 2,
        description: payload.formula.description ?? null,
        show_portal: payload.formula.showPortal ?? true,
      },
    },
	});

	if (error) throw error;
	return data;
}

export async function saveCompanyFormulaBundleQuery(payload: {
	formula: FormulaDefinition;
}) {
	const auth = await requirePermission(AuthPermission.formulaBuilder.edit);
	const supabase = await supabaseServer();

	const { data, error } = await supabase.rpc("save_company_formula_bundle", {
		p_payload: {
      company_id: auth.companyId,
      formula: {
        id: payload.formula.isNew ? null : payload.formula.id,
        label: payload.formula.label,
        key: payload.formula.label.toLowerCase(),
        expression: payload.formula.expression,
        unit: payload.formula.unit ?? null,
        decimals: payload.formula.decimals ?? 2,
        description: payload.formula.description ?? null,
        show_portal: payload.formula.showPortal ?? true,
      },
    },
	});

	if (error) throw error;
	return data;
}

export async function getEffectiveCompanyFormulasQuery(companyId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc(
    "get_effective_schema_formulas",
    { p_company_id: companyId }
  );

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.id,
    label: item.label,
    key: item.key,
    expression: item.expression,
    unit: item.unit,
    decimals: item.decimals,
    description: item.description,
    showPortal: item.show_portal,
    archived: item.archived,
  }));
}

export async function resetCoachFormulaOverrideQuery(formulaId: string) {
  const auth = await requirePermission(AuthPermission.formulaBuilder.view);
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from(TABLES.coachFormulaOverrides)
    .delete()
    .eq("company_id", auth.companyId)
    .eq("coach_user_id", auth.userId)
    .eq("formula_id", formulaId);

  if (error) throw error;
  return true;
}

export async function saveCoachFormulaOverrideQuery(
  payload: SaveCoachFormulaOverrideInput,
) {
  const auth = await requirePermission(AuthPermission.formulaBuilder.view);
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from(TABLES.coachFormulaOverrides)
    .upsert(
      {
        company_id: auth.companyId,
        coach_user_id: auth.userId,
        formula_id: payload.formula_id,
        label: payload.label ?? null,
        expression: payload.expression ?? null,
        unit: payload.unit ?? null,
        decimals: payload.decimals ?? null,
        description: payload.description ?? null,
        show_portal: payload.show_portal ?? null,
        archived: payload.archived ?? null,
        created_by: auth.userId,
        updated_by: auth.userId,
      },
      {
        onConflict: "coach_user_id,formula_id",
      },
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function saveCompanyFormulaQuery(
  payload: SaveCompanyFormulaInput,
) {
  const auth = await requirePermission(AuthPermission.formulaBuilder.edit);
  const supabase = await supabaseServer();

  const row = {
    company_id: auth.companyId,
    label: payload.label,
    key: payload.key,
    expression: payload.expression,
    unit: payload.unit ?? null,
    decimals: payload.decimals ?? 2,
    description: payload.description ?? null,
    show_portal: payload.show_portal ?? true,
    archived: payload.archived ?? false,
    updated_by: auth.userId,
  };

  if (payload.id) {
    const { data, error } = await supabase
      .from(TABLES.formulas)
      .update(row)
      .eq("id", payload.id)
      .eq("company_id", auth.companyId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from(TABLES.formulas)
    .insert({
      ...row,
      created_by: auth.userId,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}


export async function getCompanyFormulasQuery() {
	const auth = await requirePermission(AuthPermission.formulaBuilder.view);
	const supabase = await supabaseServer();

	const { data, error } = await supabase
		.from(TABLES.formulas)
		.select(`
			id,
			label,
			key,
			unit,
			decimals,
			expression,
			description,
			show_portal
		`)
		.eq("company_id", auth.companyId)
		.order("created_at", { ascending: true });

	if (error) throw error;

	return (data ?? []).map((item) => ({
		id: item.id,
		label: item.label,
		key: item.key,
		unit: item.unit,
		decimals: item.decimals,
		expression: item.expression,
		description: item.description,
		showPortal: item.show_portal,
	}));
}