import { getMember } from "@/lib/db/queries/members";
import { ArrowLeftIcon } from "@/assets/icons";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import MemberTabs from "../components/member-tabs";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const singleMember = await getMember(id);

  if (!singleMember) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <h1 className="text-2xl font-semibold">Member Not Found</h1>
        <p className="text-gray-500 mt-2">
          The member you are looking for does not exist.
        </p>

        <Link
          href="/members"
          className="inline-block mt-6 px-4 py-2 bg-black text-white rounded-lg"
        >
          Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={ROUTES.MEMBERS.LIST_MEMBER}>
        <ArrowLeftIcon className="mb-5 cursor-pointer" />
      </Link>

      {/* Client-side Tabs */}
      <MemberTabs member={singleMember} />
    </div>
  );
}

