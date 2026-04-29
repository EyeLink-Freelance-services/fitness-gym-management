import { PersonalCoachFormData } from "@/types/forms";
import { StatusOpt, SuperAdminCoachesRow } from "@/types/dashboard/super-admin";

// TODO: Replace with Spring Boot API calls once the personal-coaches endpoint is available.
export async function createPersonalCoachService(
  _form: PersonalCoachFormData,
): Promise<SuperAdminCoachesRow> {
  throw new Error(
    "Personal coach creation via backend API is not configured yet.",
  );
}

export async function findAllPersonalCoaches(): Promise<SuperAdminCoachesRow[]> {
  return [];
}

export async function getLastFivePersonalCoaches(): Promise<SuperAdminCoachesRow[]> {
  return [];
}
