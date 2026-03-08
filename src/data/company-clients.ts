import { NEW_GYM_CLIENTS } from "@/data/company";
import type { CompanyClientRow } from "@/types/dashboard/company-directory";
import { formatPlanLabel } from "@/utils/dashboard/company-directory";

export const COMPANY_CLIENT_ROWS: CompanyClientRow[] = NEW_GYM_CLIENTS.map(
  (client, index) => ({
    id: `client-${index + 1}`,
    name: client.client,
    contact: client.contact.trim() || "N/A",
    plan: formatPlanLabel(client.plan),
    joinedAt: client.date,
  }),
);
