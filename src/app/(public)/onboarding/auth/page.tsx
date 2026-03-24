import Link from "next/link";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function OnboardingAuthPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <div className="p-6">Invalid onboarding request.</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center p-6">
      <div className="rounded-2xl border border-stroke bg-white p-6 shadow-theme-sm">
        <h1 className="mb-2 text-2xl font-semibold">Continue onboarding</h1>
        <p className="mb-6 text-sm text-dark-5">
          Sign in if you already have an account, or create a new one.
        </p>

        <div className="grid gap-3">
          <Link
            href={`/auth/sign-in?next=${encodeURIComponent(`/onboarding/profile?token=${token}`)}`}
            className="rounded-lg bg-primary px-4 py-3 text-center text-white"
          >
            Sign In
          </Link>

          <Link
            href={`/auth/register?next=${encodeURIComponent(`/onboarding/profile?token=${token}`)}`}
            className="rounded-lg border border-stroke px-4 py-3 text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}