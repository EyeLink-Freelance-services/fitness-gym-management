import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { DataTable } from "@/components/Tables";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { listMembers } from "@/lib/db/queries/members";
import type { ColumnDef } from "@tanstack/react-table";
import { ClientsTable } from "./components/clients-table";

export default async function ClientsPage() {
  const members = await listMembers();

  return (
    <>
      <div className="mb-7 flex items-center justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Client"
          formType="client"
          size="small"
        />
      </div>

      <ClientsTable members={members}/>
    </>
  );
}