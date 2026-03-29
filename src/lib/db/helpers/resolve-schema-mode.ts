import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { IRole } from "@/types/auth-context";

export type SchemaMode = "company_or_personal" | "company_coach";

export async function resolveSchemaMode(): Promise<{
  mode: SchemaMode;
  companyId: string | null;
  userId: string;
}> {
  const auth = await requirePermission(AuthPermission.schemaBuilder.view);

  const roleNames = (auth.roles ?? []).map((r: string) => r.toLowerCase());


  const isCompanyMode =
    auth.isOwner === true ||
    auth.company.mode === 'personal' ||
    roleNames.includes("admin") ||
    roleNames.includes("staff");

  return {
    mode: isCompanyMode ? "company_or_personal" : "company_coach",
    companyId: auth.companyId,
    userId: auth.userId,
  };
}