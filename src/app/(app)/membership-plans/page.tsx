"use client"

import { useRouter } from "next/navigation";
import MembershipPlansList from "./components/membership-plan-list";
import { ROUTES } from "@/constants/route";
import { useEffect, useState } from "react";
import { listMembershipPlanAction } from "./actions";
import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";

const mockPlans = [
  {
    id: "1",
    name: "Basic Monthly",
    price: 1500,
    entree_fee: 500,
    duration_days: 30,
    is_monthly: true,
    description: "Access to gym equipment during standard hours.",
    is_active: true,
  },
  {
    id: "2",
    name: "Premium Quarterly",
    price: 4000,
    entree_fee: 700,
    duration_days: 90,
    is_monthly: true,
    description: "Includes group classes and coach follow-up.",
    is_active: true,
  },
  {
    id: "3",
    name: "Weekly Pass",
    price: 500,
    entree_fee: 0,
    duration_days: 7,
    is_monthly: false,
    description: "Short-term access for one week.",
    is_active: false,
  },
];

export default function MembershipPlansPage() {
	const router = useRouter();
	const [membershipPlans, setMembershipPlans] = useState<MembershipPlanRow[] | undefined>([]);
	const [loading, setLoading] = useState<boolean>(false);

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
        onToggleActive={(plan) => console.log("toggle active", plan)}
      />
    </div>
  );
}