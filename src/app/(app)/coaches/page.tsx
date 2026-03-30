import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_COACH_ROWS } from "@/data/company-coaches";
import type { CompanyCoachRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";
import { CoachTable } from "./components/coach-table";

export default async function CompanyCoachesPage() {
  const coaches: CompanyCoachRow[] = await COMPANY_COACH_ROWS;
  return (
    <>
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Coach"
          formType="personal"
          size="small"
        />
      </div>

      <CoachTable coaches={coaches}/>
    </>
  );
}
