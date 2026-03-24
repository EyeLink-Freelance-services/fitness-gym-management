import { ROUTES } from "@/constants/route";
import Link from "next/link";

export default function OnboardingSuccessPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center p-6">
      <div className="rounded-2xl border border-stroke bg-white p-6 shadow-theme-sm">
        <h1 className="mb-2 text-2xl font-semibold">Onboarding completed</h1>
        <p className="mb-6 text-sm text-dark-5">
          Your workspace is ready. You can now enter the application.
        </p>

        <Link
          href={ROUTES.HOME}
          className="inline-flex rounded-lg bg-primary px-4 py-3 text-white"
        >
         Start Application
        </Link>
      </div>
    </div>
  );
}