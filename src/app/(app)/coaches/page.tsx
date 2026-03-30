import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { COMPANY_COACH_ROWS } from "@/data/company-coaches";
import type { CompanyCoachRow } from "@/types/dashboard/company-directory";
import type { ColumnDef } from "@tanstack/react-table";
import { CoachTable } from "./components/coach-table";
import { getCoachCompanyAction } from "./actions";

export default async function CompanyCoachesPage() {
  const coaches = await getCoachCompanyAction();

  if(!coaches.ok) {
    return <div>{coaches.message}</div>
  }

  return (
    <>
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Coach"
          formType="personal"
          size="small"
        />
      </div>

      <CoachTable coaches={coaches.data as CompanyCoachRow[]}/>
    </>
  );
}
