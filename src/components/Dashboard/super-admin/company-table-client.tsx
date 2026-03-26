"use client";

import { DataTable } from "@/components/Tables";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { SuperAdminCompanyRow } from "@/types/dashboard/super-admin";
import { superAdminCompanyColumns } from "@/components/Dashboard/table-column/super-admin-column";

interface CompanyTableClientProps {
  data: SuperAdminCompanyRow[];
}

export default function CompanyTableClient({ data }: CompanyTableClientProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FormModalTrigger buttonLabel="+ Add Company" formType="company" />
      </div>

      <DataTable
        title="Companies"
        description="Companies across all locations."
        data={data}
        columns={superAdminCompanyColumns}
        searchPlaceholder="Search company, email, specialization..."
        initialPageSize={10}
        emptyStateLabel="No companies available."
        getRowId={(row) => row.id}
        tableClassName="min-w-[760px]"
      />
    </div>
  );
}
