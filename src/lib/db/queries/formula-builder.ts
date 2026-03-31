import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { supabaseServer } from "@/lib/supabase/server";
import { FormulaDefinition } from "@/types/dashboard";

const TABLES = {
  formulas: "formulas",
  coachFormulaOverrides: "coach_formulas_overrides",
} as const;

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