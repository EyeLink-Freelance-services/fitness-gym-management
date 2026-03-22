'use client'

import AssignMembersContent from "@/components/AssignMembersContent";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui-elements/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import DietPlanBuilder from "./diet-plan-builder";
import { DietPlanFormValues } from "@/lib/validation/schemas/diet-plans";
import { useAuth } from "@/app/context/auth-context";
import { useCompany } from "@/app/context/company-context";
import { assignDietPlanToMembersAction } from "../actions";
import { toast } from "sonner";

type Props = {
  initialPlan: any;
  title: string;
  onSubmit?: (values: DietPlanFormValues) => Promise<any> | void;
  readOnly?: boolean
};

export default function DietPlanClient({ initialPlan, title, readOnly=false, onSubmit }: Props) {
  const [openAssignMemberModal, setOpenAssignMemberModal] = useState(false);
  const company = useCompany();
  const auth = useAuth();

  return (
    <div>
      <PageHeader
        title={title}
        description="All about meals for this plan"
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
          type="diet"
          planId={initialPlan.id}
          assignedCoachId={auth.userId}
          companyId={company.id}
          onClose={() => setOpenAssignMemberModal(false)}
          onAssign={ async ({ memberIds, startDate }) => {
            const res = await assignDietPlanToMembersAction({
              companyId: company.id,
              dietPlanId: initialPlan.id,
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

      
      <DietPlanBuilder
        initialValues={initialPlan}
        readOnly={readOnly}
        onSubmit={onSubmit}
      />
    </div>
  );
}