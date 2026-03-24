import Header from "@/components/FormElements/common/header";
import CreateInviteForm from "./components/create-invite-form";

export default function SuperAdminOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-4 lg:p-6">
      <Header
        label="- Administration"
        title="Onboarding Invitations"
        subtitle="Create invitations for personal or company workspace onboarding"
      />

      <CreateInviteForm />
    </div>
  );
}