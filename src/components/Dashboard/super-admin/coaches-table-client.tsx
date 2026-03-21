"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { superAdminCoachColumns } from "@/components/Dashboard/table-column/super-admin-column";
import { DataTable } from "@/components/Tables";
import type { SuperAdminCoachesRow } from "@/types/dashboard/super-admin";

interface CoachesTableClientProps {
  data: SuperAdminCoachesRow[];
}

export function CoachesTableClient({ data }: CoachesTableClientProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Personal Coach"
          formType="personal"
        />
      </div>

      <DataTable
        title="Coaches"
        description="Personal coaches across all locations."
        data={data}
        columns={superAdminCoachColumns}
        searchPlaceholder="Search coach, email, specialization..."
        initialPageSize={10}
        emptyStateLabel="No coaches available."
        getRowId={(row) => row.id}
        tableClassName="min-w-[760px]"
      />
    </div>
  );
}
