import { ArrowLeftIcon } from "@/assets/icons";
import { ROUTES } from "@/constants/route";
import { getMembershipPlan } from "@/lib/db/queries/membership-plan";
import Link from "next/link";
import MembershipPlanView from "../components/membership-plan-view";
import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";

export default async function ViewPage({params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
	const singleMembershipPlan: MembershipPlanRow = await getMembershipPlan(id);

	return (
		<div className="space-y-6">
      <Link href={ROUTES.MEMBERSHIP.LIST_MEMBERSHIP}>
        <ArrowLeftIcon className="mb-5 cursor-pointer" />
      </Link>

      {/* Client-side Tabs */}
      <MembershipPlanView plan={singleMembershipPlan} />
    </div>
	);
}