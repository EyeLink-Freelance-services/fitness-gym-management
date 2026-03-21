import type { CompanyCoachRow } from "@/types/dashboard/company-directory";
import { GYM_CLIENTS } from "@/data/company";

const coachForClient = GYM_CLIENTS[0]?.coach;
export const COMPANY_COACH_ROWS: CompanyCoachRow[] = coachForClient
  ? [
      {
        id: "coach-1",
        name: coachForClient,
        email: "john@example.com",
        clients: GYM_CLIENTS.filter((c) => c.coach === coachForClient).length,
        status: "Active",
        statusTone: "success",
      },
    ]
  : [];
