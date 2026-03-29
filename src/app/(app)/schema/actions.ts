"use server";

import { resolveSchemaMode, SchemaMode } from "@/lib/db/helpers/resolve-schema-mode";
import { getCompanyFieldGroupsQuery, getCompanySchemaOverviewQuery, getCompanySchemaValidationRulesQuery, getEffectiveFieldGroupsQuery, getEffectiveSchemaValidationRulesQuery, resetCoachFieldOverrideQuery, resetCoachGroupOverrideQuery, resetCoachValidationRuleOverrideQuery, SaveCoachFieldOverrideInput, saveCoachFieldOverrideQuery, SaveCoachGroupOverrideInput, saveCoachGroupOverrideQuery, saveCoachSchemaOverrideBundleQuery, SaveCoachValidationRuleOverrideInput, saveCoachValidationRuleOverrideQuery, saveCompanySchemaBundleQuery, SaveCompanySchemaFieldInput, saveCompanySchemaFieldQuery, SaveCompanySchemaGroupInput, saveCompanySchemaGroupQuery, SaveCompanyValidationRuleInput, saveCompanyValidationRuleQuery } from "@/lib/db/queries/schema-builder";
import { FieldGroup, FullSchema, SchemaSummary, SchemaValidationRuleSummary } from "@/types/dashboard";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/schema";

export async function saveCompanySchemaBundleAction(payload: {
  groups: FieldGroup[];
  validationRules: any[];
}) {
  try {
    const data = await saveCompanySchemaBundleQuery(payload);
    revalidatePath(REVALIDATE_PATH);
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, message: error?.message ?? "failed to save company schema bundle" };
  }
}

export async function saveCoachSchemaOverrideBundleAction(payload: {
  groups?: any[];
  fields?: any[];
  validationRules?: any[];
}) {
  try {
    const data = await saveCoachSchemaOverrideBundleQuery(payload);
    revalidatePath(REVALIDATE_PATH);
    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, message: error?.message ?? "failed to save coach schema override bundle" };
  }
}


export async function getSchemaPageDataAction() {
  try {
    const { mode, companyId } = await resolveSchemaMode();
    if(companyId != null) {
      const [summary, groups, rules] =
        mode === "company_or_personal"
          ? await Promise.all([
              getCompanySchemaOverviewQuery(),
              getCompanyFieldGroupsQuery(),
              getCompanySchemaValidationRulesQuery(),
            ])
          : await Promise.all([
              getCompanySchemaOverviewQuery(), // summary can stay company based
              getEffectiveFieldGroupsQuery(companyId),
              getEffectiveSchemaValidationRulesQuery(companyId),
            ]);
  
      return {
        ok: true,
        data: {
          mode: mode as SchemaMode,
          summary: {
            id: summary?.id ?? "",
            ownerType: "company",
            ownerName: summary?.ownerName ?? "",
            schemaLabel: summary?.schemaLabel ?? "Company Performance Schema",
            activeVersion: summary?.activeVersion ?? "v1",
            totalGroups: summary?.totalGroups ?? 0,
            totalFields: summary?.totalFields ?? 0,
            totalFormulas: summary?.totalFormulas ?? 0,
            linkedClients: summary?.linkedClients ?? 0,
            updatedAt: summary?.updatedAt ?? new Date().toISOString(),
            status: "active",
          } as SchemaSummary,
          groups: groups as FieldGroup[] ?? [],
          rules: rules as SchemaValidationRuleSummary[] ?? [],
        } as FullSchema,
      };
    }

    return  {
      ok: false,
      data: {
        mode,
          summary: {
            id: "",
            ownerType: "",
            ownerName: "",
            schemaLabel: "",
            activeVersion: "v1",
            totalGroups:  0,
            totalFields: 0,
            totalFormulas:  0,
            linkedClients:  0,
            updatedAt: new Date().toISOString(),
            status: "active",
          },
          groups: [],
          rules: [],
      }
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to load schema page data",
    };
  }
}

export async function saveCompanySchemaGroupAction(
  payload: SaveCompanySchemaGroupInput,
) {
  try {
    const data = await saveCompanySchemaGroupQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save company schema group",
    };
  }
}

export async function saveCompanySchemaFieldAction(
  payload: SaveCompanySchemaFieldInput,
) {
  try {
    const data = await saveCompanySchemaFieldQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save company schema field",
    };
  }
}

export async function saveCompanyValidationRuleAction(
  payload: SaveCompanyValidationRuleInput,
) {
  try {
    const data = await saveCompanyValidationRuleQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save company validation rule",
    };
  }
}

export async function saveCoachGroupOverrideAction(
  payload: SaveCoachGroupOverrideInput,
) {
  try {
    const data = await saveCoachGroupOverrideQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save coach group override",
    };
  }
}

export async function saveCoachFieldOverrideAction(
  payload: SaveCoachFieldOverrideInput,
) {
  try {
    const data = await saveCoachFieldOverrideQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save coach field override",
    };
  }
}

export async function saveCoachValidationRuleOverrideAction(
  payload: SaveCoachValidationRuleOverrideInput,
) {
  try {
    const data = await saveCoachValidationRuleOverrideQuery(payload);
    revalidatePath(REVALIDATE_PATH);

    return {
      ok: true,
      data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to save coach validation rule override",
    };
  }
}

export async function resetCoachGroupOverrideAction(groupId: string) {
  try {
    await resetCoachGroupOverrideQuery(groupId);
    revalidatePath(REVALIDATE_PATH);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to reset coach group override",
    };
  }
}

export async function resetCoachFieldOverrideAction(fieldId: string) {
  try {
    await resetCoachFieldOverrideQuery(fieldId);
    revalidatePath(REVALIDATE_PATH);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to reset coach field override",
    };
  }
}

export async function resetCoachValidationRuleOverrideAction(validationRuleId: string) {
  try {
    await resetCoachValidationRuleOverrideQuery(validationRuleId);
    revalidatePath(REVALIDATE_PATH);

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to reset coach validation rule override",
    };
  }
}

export async function getCompanySchemaOverviewAction() {
  try {
    const summary = await getCompanySchemaOverviewQuery();

    return {
      ok: true,
      data: {
        id: summary?.id ?? "",
        ownerType: "company",
        ownerName: summary?.ownerName ?? "",
        schemaLabel: summary?.schemaLabel ?? "Company Performance Schema",
        activeVersion: summary?.activeVersion ?? "v1",
        totalGroups: summary?.totalGroups ?? 0,
        totalFields: summary?.totalFields ?? 0,
        totalFormulas: summary?.totalFormulas ?? 0,
        linkedClients: summary?.linkedClients ?? 0,
        updatedAt: summary?.updatedAt ?? new Date().toISOString(),
        status: "active",
      } as SchemaSummary,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to get company schema overview",
    };
  }
}

export async function getCompanyFieldGroupsAction() {
  try {
    const groups = await getCompanyFieldGroupsQuery();

    return {
      ok: true,
      data: groups,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to get company field groups",
    };
  }
}

export async function getCompanySchemaValidationRulesAction() {
  try {
    const rules = await getCompanySchemaValidationRulesQuery();

    return {
      ok: true,
      data: rules,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message ?? "failed to get company schema validation rules",
    };
  }
}