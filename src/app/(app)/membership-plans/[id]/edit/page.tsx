import { ROUTES } from "@/constants/route";
import { getMembershipPlan } from "@/lib/db/queries/membership-plan";
import EditMembershipPlanForm from "../../components/membership-plan-edit";
import { ArrowLeftIcon } from "@/assets/icons";
import Link from "next/link";
import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";


export default async function EditPage({params,
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

      {/* Client-side EditMembershipPlanForm */}
      <EditMembershipPlanForm plan={singleMembershipPlan} />
    </div>
	);
}