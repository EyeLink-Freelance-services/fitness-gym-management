import { useCompany } from "@/app/context/company-context";
import MembershipPlansSelector from "../../membership-plans/components/membership-plan-selector";
import { useEffect, useState } from "react";
import { MemberTabsProps } from "./member-tabs";
import { getMembershipPlanAction } from "../actions";
import { SkeletonUI } from "@/components/ui/skeleton";

export function MembershipPlanTab({member}: MemberTabsProps) {
  const company = useCompany();
	const [selectedPlan, setSelectedPlan] = useState<{id: string} | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		const getMembershipPlanOfMember = async () => {
			setLoading(true);
			const res = await getMembershipPlanAction(member.id, company.company_id)
			if(!res.ok) {
				setErrorMsg(res.message)
			} else if(res.data) {
				setSelectedPlan({id: res.data.plan_id});
			}
			setLoading(false);
		}

		getMembershipPlanOfMember();
	}, []);

	return (
		<div>
			{errorMsg && (
				<div className="mb-2 text-sm text-red-600">{errorMsg}</div>
			)}
			{
				loading ? (
					<div className="w-full flex flex-col gap-2 h-full">
						<SkeletonUI className="h-5 w-20 mx-auto" />
						<SkeletonUI className="h-10 w-80 bg-gray-3 mx-auto" />
						<SkeletonUI className="h-10 w-50 bg-gray-3 mx-auto" />
						<SkeletonUI className="h-80 w-200 mt-5 bg-gray-3 " />
					</div>
				) : (
					<MembershipPlansSelector selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
				)
			}
		</div>
	)
}