import { getMember } from "@/lib/db/queries/members";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import MemberTabs from "../components/member-tabs";
import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui-elements/button";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const singleMember = await getMember(id);

  if (!singleMember) {
    return (
      <div className="mx-auto mt-10 max-w-xl text-center">
        <h1 className="text-2xl font-semibold">Member Not Found</h1>
        <p className="mt-2 text-gray-500">
          The member you are looking for does not exist.
        </p>

        <Link
          href="/members"
          className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-white"
        >
          Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client-side Tabs */}
      <MemberTabs member={singleMember} />
    </div>
  );
}
