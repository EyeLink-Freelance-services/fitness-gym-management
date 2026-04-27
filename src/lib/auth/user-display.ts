import type { IAuthContext, IRole } from "@/types/auth/auth-context";

export interface UserDisplayInfo {
  displayName: string;
  fullName: string;
  initial: string;
  subtitle: string;
  avatarSrc: string;
}

const DEFAULT_AVATAR = "/images/user/user-03.png";

export function getUserDisplayInfo(
  auth: Pick<IAuthContext, "profile" | "company" | "roles">
): UserDisplayInfo {
  const { profile, company, roles } = auth;
  const firstName = profile?.first_name ?? "User";
  const lastName = profile?.last_name ?? "";
  const fullName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
  const displayName = fullName || "Account";

  const firstRole = roles?.[0];
  const roleName =
    typeof firstRole === "string"
      ? firstRole
      : typeof firstRole === "object" && firstRole !== null && "name" in firstRole
        ? (firstRole as IRole).name
        : undefined;
  const subtitle = company?.name ?? roleName ?? "Signed in";

  return {
    displayName,
    fullName,
    initial: `${firstName[0]}${lastName[0] ?? ""}`.trim(),
    subtitle,
    avatarSrc: profile?.picture_url ?? DEFAULT_AVATAR,
  };
}