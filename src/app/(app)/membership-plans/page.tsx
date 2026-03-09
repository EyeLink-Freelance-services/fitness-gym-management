"use client"

import { useRouter } from "next/navigation";
import MembershipPlansList from "./components/membership-plan-list";
import { ROUTES } from "@/constants/route";
import { useEffect, useState } from "react";
import { listMembershipPlanAction, updateMembershipPlanAction } from "./actions";
import { MembershipPlanEditInput, MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";

export default function MembershipPlansPage() {
	const router = useRouter();
	const [membershipPlans, setMembershipPlans] = useState<MembershipPlanRow[] | undefined>([]);
	const [loading, setLoading] = useState(false);

  const handleToggleActive = async (plan: MembershipPlanEditInput) => {
    setLoading(true);

    const previousPlans = membershipPlans;

    setMembershipPlans((current) =>
      current?.map((item) =>
        item.id === plan.id
          ? { ...item, is_active: plan.is_active }
          : item
      )
    );

    const res = await updateMembershipPlanAction(plan);

    if (!res.ok) {
      setMembershipPlans(previousPlans);
    } else {
      router.refresh();
    }

    setLoading(false);
  };

	useEffect(() => {
		const getListMembershipPlan = async () => {
			setLoading(true);
			const listMembershipPlan = await listMembershipPlanAction();
			setMembershipPlans(listMembershipPlan.data);
			setLoading(false)
		};
		getListMembershipPlan();
	}, [])

  return (
    <div className="p-4">
      <MembershipPlansList
				loading={loading}
        plans={membershipPlans}
        onCreate={() => router.push(ROUTES.MEMBERSHIP.NEW_MEMBERSHIP)}
        onView={(plan) => router.push(ROUTES.MEMBERSHIP.ID(plan.id))}
        onEdit={(plan) => router.push(ROUTES.MEMBERSHIP.EDIT_MEMBERSHIP(plan.id))}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}