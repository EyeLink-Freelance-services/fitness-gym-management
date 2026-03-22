"use client";

import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import TrainingPlanBuilder from "../components/training-plan-builder";
import PageHeader from "@/components/PageHeader";
import { Modal } from "@/components/ui/modal";
import AssignMembersContent from "@/components/AssignMembersContent";
import { useCompany } from "@/app/context/company-context";
import { useAuth } from "@/app/context/auth-context";
import { assignTrainingPlanToMembersAction } from "../actions";
import { toast } from "sonner";

type Props = {
  initialPlan: any;
};

export default function TrainingPlanPageClient({ initialPlan }: Props) {
  const [openAssignMemberModal, setOpenAssignMemberModal] = useState(false);
  const company = useCompany();
  const auth = useAuth();

  return (
    <div>
      <PageHeader
        title="Training Plan"
        description="View/Edit sessions and exercises for this plan"
        rightContent={
          <Button
            onClick={() => setOpenAssignMemberModal(true)}
            variant="dark"
            label="Assign Members"
          />
        }
      />

      <Modal
        badge="Assignment"
        title="Assign Members"
        description="Select members to assign this training plan"
        open={openAssignMemberModal}
        onClose={() => setOpenAssignMemberModal(false)}
      >
        <AssignMembersContent 
          assignedCoachId={auth.userId}
          companyId={company.id}
          onClose={() => setOpenAssignMemberModal(false)}
          onAssign={ async ({ memberIds, startDate }) => {
            console.log(auth.userId, 'auth');
            const res = await assignTrainingPlanToMembersAction({
              companyId: company.id,
              trainingPlanId: initialPlan.id,
              memberIds,
              assigned_by: auth.userId,
              startDate,
            });

            if (res.ok) {
              toast.success(res.message ?? "Members assigned successfully");
              setOpenAssignMemberModal(false);
            } else {
              toast.error(res.message ?? "Failed to assign members");
            }
          }}
        />
      </Modal>

      <div className="mx-auto w-full max-w-[2000px] px-4 pb-8 md:px-6 lg:px-0">
        <div className="overflow-hidden rounded-3xl border border-stroke/70 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <TrainingPlanBuilder initialPlan={initialPlan} />
        </div>
      </div>
    </div>
  );
}