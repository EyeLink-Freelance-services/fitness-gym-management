import { getInviteByToken } from "@/lib/db/queries/onboarding";
import OnboardingProfileForm from "../components/onboaring-profile-form";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function OnboardingProfilePage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <div className="p-6">Invalid invitation.</div>;
  }

  const invite = await getInviteByToken(token);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center p-6">
      <OnboardingProfileForm token={token} invite={invite[0]} />
    </div>
  );
}