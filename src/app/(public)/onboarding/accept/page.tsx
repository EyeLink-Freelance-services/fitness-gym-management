import { getInviteByToken } from "@/lib/db/queries/onboarding";
import AcceptInviteTermsForm from "../components/accept-invite-form";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AcceptOnboardingInvitePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <div className="p-6">Invalid invitation link.</div>;
  }

  let invite;
  try {
    invite = await getInviteByToken(token);
  } catch(error) {
    console.log(error, 'pl')
    return <div className="p-6">Invitation not found.</div>;
  }
  
  console.log(invite[0].status, 'invite')
  if (invite[0].status !== "pending") {
    return <div className="p-6">This invitation is no longer available.</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center p-6">
      <AcceptInviteTermsForm rawToken={token} invite={invite[0]} />
    </div>
  );
}