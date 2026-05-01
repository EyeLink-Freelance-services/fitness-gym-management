import { capitalize } from "@/utils/dashboard/shared";

export const getUserDetails = (auth: any) => {
  const { profile, roles } = auth;

  const firstName = capitalize(profile?.first_name) ?? "";
  const lastName = capitalize(profile?.last_name) ?? "";
  const displayName = `${firstName[0]}${lastName[0] ?? ""}`.trim();
  const role = roles[0].toUpperCase();
  const profilePic = profile?.picture_url;

  return {
    firstName,
    displayName,
    role,
    profilePic,
  };
};
