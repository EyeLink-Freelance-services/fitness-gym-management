import { getMember } from "@/lib/db/queries/members";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import { ArrowLeftIcon } from "@/components/IconsCollection/icons";
import ClientTabs from "../components/clients-tabs";
import { Member } from "@/types/member";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const singleMember: Member  = await getMember(id);

  if (!singleMember) {
    return (
      <div className="mx-auto mt-10 max-w-xl text-center">
        <h1 className="text-2xl font-semibold">Client Not Found</h1>
        <p className="mt-2 text-gray-500">
          The client you are looking for does not exist.
        </p>

        <Link
          href="/members"
          className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-white"
        >
          Back to list of clients
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-5">
      <Link href={ROUTES.CLIENTS.LIST_CLIENT}>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stroke bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-white/5"
        >
          <ArrowLeftIcon />
        </button>
      </Link>

      {/* Client-side Tabs */}
      <ClientTabs client={singleMember} />
    </div>
  );
}
