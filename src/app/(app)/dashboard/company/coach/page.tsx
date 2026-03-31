import { ClientsTable } from "@/app/(app)/clients/components/clients-table";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { AuthPermission } from "@/constants/permission";
import { requirePermission } from "@/lib/auth/permission";
import { listMembers } from "@/lib/db/queries/members";

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