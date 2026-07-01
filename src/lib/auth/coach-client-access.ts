import { notFound } from "next/navigation";
import { getRoleFromAuthContext } from "@/config/routes.config";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getCompanyClientById } from "@/services/company/company.service";

export async function assertCoachCanAccessClient(clientId: string): Promise<void> {
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);

  if (role !== "company-coach") return;

  const client = await getCompanyClientById(clientId);
  if (!client) {
    notFound();
  }
}
