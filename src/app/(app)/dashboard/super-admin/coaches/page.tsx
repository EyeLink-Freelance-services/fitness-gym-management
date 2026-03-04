import { TableUI } from "@/components/Tables";
import { Skeleton } from "@/components/Tables/skeleton";
import { Suspense } from "react";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { getTopCoaches } from "@/data/superAdmin";

export default function CompanyCoachesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FormModalTrigger buttonLabel="Add Coach" formType="personal" />
      </div>

      <Suspense fallback={<Skeleton />}>
        <TableUI title="Coaches" data={getTopCoaches()} />
      </Suspense>
    </div>
  );
}
