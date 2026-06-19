import { notFound } from "next/navigation";
import { loadClientProfileData } from "@/app/(app)/dashboard/company/clients/actions";
import { ClientProfilePage } from "@/components/Dashboard/company/client-profile/client-profile-page";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientProfileRoute({ params }: Props) {
  const { clientId } = await params;
  const profileData = await loadClientProfileData(clientId);

  if (!profileData) {
    notFound();
  }

  return (
    <ClientProfilePage
      client={profileData.client}
      companyPricing={profileData.companyPricing}
      initialDiets={profileData.initialDiets}
      initialTrainingPlans={profileData.initialTrainingPlans}
    />
  );
}
