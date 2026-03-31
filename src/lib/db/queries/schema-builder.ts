import { supabaseServer } from "@/lib/supabase/server";
import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { FieldGroup } from "@/types/dashboard";


const TABLES = {
  groups: "client_data_schema_groups",
  fields: "client_data_schema_fields",
  rules: "client_data_schema_validation_rules",

  coachGroupOverrides: "coach_schema_group_overrides",
  coachFieldOverrides: "coach_schema_field_overrides",
  coachRuleOverrides: "coach_schema_validation_rule_overrides",
} as const;

type GroupRow = {
  id: string;
  name: string;
  description: string | null;
  accent_color: string | null;
  icon_key: string | null;
  unit_hint: string | null;
  sort_order: number;
  archived: boolean;
};

type FieldRow = {
  id: string;
  group_id: string;
  label: string;
  key: string;
  type: string;
  unit: string | null;
  placeholder: string | null;
  description: string | null;
  required: boolean;
  read_only: boolean;
  show_portal: boolean;
  archived: boolean;
  sort_order: number;
  options: Array<{ label: string; value: string }> | null;
  validation: Record<string, unknown> | null;
};


function mapField(field: any) {
  return {
    id: field.isNew ? null : field.id,
    label: field.label,
    key: field.key,
    type: field.type,
    unit: field.unit ?? null,
    placeholder: field.placeholder ?? null,
    description: field.description ?? null,
    required: field.required ?? false,
    read_only: field.readOnly ?? false,
    show_portal: field.showPortal ?? false,
    archived: field.archived ?? false,
    sort_order: field.sortOrder ?? 0,
    options: field.options ?? [],
    validation: field.validation ?? {},
  };
}

function mapGroup(group: FieldGroup) {
  return {
    id: group.isNew ? null : group.id,
    name: group.name,
    description: group.description ?? null,
    accent_color: group.accentColor ?? null,
    icon_key: group.iconKey ?? null,
    unit_hint: group.unitHint ?? null,
    sort_order: group.sortOrder ?? 0,
    fields: (group.fields ?? []).map(mapField),
  };
}

export async function saveCoachSchemaOverrideBundleQuery(payload: {
  groups?: any[];
  fields?: any[];
  validationRules?: any[];
}) {
  const auth = await requirePermission(AuthPermission.schemaBuilder.edit);
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("save_coach_schema_override_bundle", {
    p_payload: {
      company_id: auth.companyId,
      groups: (payload.groups ?? []).map((group) => ({
        group_id: group.id,
        name: group.name ?? null,
        description: group.description ?? null,
        accent_color: group.accentColor ?? null,
        icon_key: group.iconKey ?? null,
        unit_hint: group.unitHint ?? null,
        sort_order: group.sortOrder ?? null,
        archived: group.archived ?? null,
      })),
      fields: (payload.fields ?? []).map((field) => ({
        field_id: field.id,
        label: field.label ?? null,
        unit: field.unit ?? null,
        placeholder: field.placeholder ?? null,
        description: field.description ?? null,
        required: field.required ?? null,
        read_only: field.readOnly ?? null,
        show_portal: field.showPortal ?? null,
        archived: field.archived ?? null,
        sort_order: field.sortOrder ?? null,
        options: field.options ?? null,
        validation: field.validation ?? null,
      })),
      validation_rules: (payload.validationRules ?? []).map((rule) => ({
        validation_rule_id: rule.id,
        title: rule.title ?? null,
        description: rule.description ?? null,
        value: rule.value ?? null,
        sort_order: rule.sortOrder ?? null,
        archived: rule.archived ?? null,
      })),
    },
  });

  if (error) throw error;
  return data;
}

export async function saveCompanySchemaBundleQuery(payload: {
  groups: FieldGroup[];
  validationRules: any[];
}) {
  const auth = await requirePermission(AuthPermission.schemaBuilder.edit);
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("save_company_schema_bundle", {
    p_payload: {
      company_id: auth.companyId,
      groups: payload.groups.map(mapGroup),
      validation_rules: payload.validationRules.map((rule) => ({
        id: rule.isNew ? null : rule.id,
        title: rule.title,
        description: rule.description ?? null,
        value: rule.value,
        sort_order: rule.sortOrder ?? 0,
        archived: rule.archived ?? false,
      })),
    },
  });

  if (error) throw error;
  return data;
}


export async function getEffectiveFieldGroupsQuery(companyId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc(
    "get_effective_schema_field_groups",
    { p_company_id: companyId }
  );

  if (error) throw error;
  return data ?? [];
}

export async function getEffectiveSchemaValidationRulesQuery(companyId: string) {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc(
    "get_effective_schema_validation_rules",
    { p_company_id: companyId }
  );

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    value: item.value,
  }));
}

export async function resetCoachGroupOverrideQuery(groupId: string) {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from(TABLES.coachGroupOverrides)
    .delete()
    .eq("company_id", auth.companyId)
    .eq("coach_user_id", auth.userId)
    .eq("group_id", groupId);

  if (error) throw error;
  return true;
}

export async function resetCoachFieldOverrideQuery(fieldId: string) {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from(TABLES.coachFieldOverrides)
    .delete()
    .eq("company_id", auth.companyId)
    .eq("coach_user_id", auth.userId)
    .eq("field_id", fieldId);

  if (error) throw error;
  return true;
}

export async function resetCoachValidationRuleOverrideQuery(validationRuleId: string) {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from(TABLES.coachRuleOverrides)
    .delete()
    .eq("company_id", auth.companyId)
    .eq("coach_user_id", auth.userId)
    .eq("validation_rule_id", validationRuleId);

  if (error) throw error;
  return true;
}

export async function getCompanySchemaOverviewQuery() {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("get_company_schema_overview", {
    p_company_id: auth.companyId,
  });

  if (error) throw error;
  return data;
}

export async function getCompanyFieldGroupsQuery() {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { data: groups, error: groupsError } = await supabase
    .from("client_data_schema_groups")
    .select(`
      id,
      name,
      description,
      accent_color,
      icon_key,
      unit_hint,
      sort_order,
      archived
    `)
    .eq("company_id", auth.companyId)
    .eq("archived", false)
    .order("sort_order", { ascending: true });

  if (groupsError) throw groupsError;

  const groupIds = (groups ?? []).map((g) => g.id);

  let fields: FieldRow[] = [];

  if (groupIds.length > 0) {
    const { data: schemaFields, error: schemaFieldsError } = await supabase
      .from("client_data_schema_fields")
      .select(`
        id,
        group_id,
        label,
        key,
        type,
        unit,
        placeholder,
        description,
        required,
        read_only,
        show_portal,
        archived,
        sort_order,
        options,
        validation
      `)
      .eq("company_id", auth.companyId)
      .eq("archived", false)
      .in("group_id", groupIds)
      .order("sort_order", { ascending: true });

    if (schemaFieldsError) throw schemaFieldsError;
    fields = schemaFields ?? [];
  }

  return (groups ?? []).map((group: GroupRow) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    accentColor: group.accent_color,
    iconKey: group.icon_key,
    unitHint: group.unit_hint,
    sortOrder: group.sort_order,
    archived: group.archived,
    fields: fields
      .filter((field) => field.group_id === group.id)
      .map((field) => ({
        id: field.id,
        groupId: field.group_id,
        label: field.label,
        key: field.key,
        type: field.type,
        unit: field.unit,
        placeholder: field.placeholder,
        description: field.description,
        required: field.required,
        readOnly: field.read_only,
        showPortal: field.show_portal,
        archived: field.archived,
        sortOrder: field.sort_order,
        options: field.options ?? [],
        validation: field.validation ?? {},
      })),
  }));
}

export async function getCompanySchemaValidationRulesQuery() {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("client_data_schema_validation_rules")
    .select(`
      id,
      title,
      description,
      value
    `)
    .eq("company_id", auth.companyId)
    .eq("archived", false)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    value: item.value,
  }));
}