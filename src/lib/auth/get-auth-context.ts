import { cache } from "react";
import type { IAuthContext } from "@/types/auth/auth-context";
import { getAuthSession } from "@/auth";
import type { AccessTokenClaims } from "@/types/auth/token";

function inferCompanyMode(contextType?: string): "company" | "personal" | "super-admin" {
  const value = (contextType ?? "").toUpperCase();
  if (value.includes("PERSONAL")) return "personal";
  if (value.includes("SUPER")) return "super-admin";
  return "company";
}

function mapClaimsToAuthContext(claims: AccessTokenClaims): IAuthContext {
  const email = claims.email ?? claims.sub ?? "";
  const contextType = claims.contextType ?? "COMPANY";
  const businessId = claims.businessId ?? null;
  const companyId = claims.companyId ?? businessId;
  const clientId = claims.clientId ?? null;
  const companyMode = inferCompanyMode(contextType);
  const [firstName = "User", ...lastNameParts] = email.split("@")[0]?.split(".") ?? [];

  return {
    userId: claims.userId ?? claims.sub ?? "",
    email,
    contextType,
    clientId,
    profile: {
      id: claims.userId ?? claims.sub ?? "",
      first_name: firstName,
      last_name: lastNameParts.join(" "),
      picture_url: "",
      active_company_id: companyId,
    },
    companyId,
    company: companyId
      ? {
          id: companyId,
          name: companyId,
          mode: companyMode,
        }
      : null,
    isOwner: (claims.roles ?? []).some((role) => role.toLowerCase().includes("owner")),
    roles: claims.roles ?? [],
    permissions: claims.permissions ?? [],
    availableContexts:
      claims.availableContexts?.map((ctx) => ({
        contextType: ctx.contextType ?? "COMPANY",
        businessId: ctx.businessId ?? "SUPER-ADMIN",
        roles: ctx.roles,
        permissions: ctx.permissions,
      })) ?? [],
  };
}

export const getAuthContext = cache(async (): Promise<IAuthContext | null> => {
  const session = await getAuthSession();
  if (!session?.accessToken || !session.claims) return null;
  return mapClaimsToAuthContext(session.claims);
});
