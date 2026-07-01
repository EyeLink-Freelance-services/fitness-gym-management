import { notFound } from "next/navigation";
import { loadClientProfileData } from "@/app/(app)/dashboard/company/clients/actions";
import { ClientProfilePage } from "@/components/Dashboard/company/client-profile/client-profile-page";
import { assertCoachCanAccessClient } from "@/lib/auth/coach-client-access";
import { getAuthContext } from "@/lib/auth/get-auth-context";
import { getRoleFromAuthContext } from "@/config/routes.config";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientProfileRoute({ params }: Props) {
  const { clientId } = await params;
  const auth = await getAuthContext();
  const role = getRoleFromAuthContext(auth);
  const isCoach = role === "company-coach";

  await assertCoachCanAccessClient(clientId);

  const profileData = await loadClientProfileData(clientId, {
    skipCompanyPricing: isCoach,
  });

  if (!profileData) {
    notFound();
  }

  return (
    <ClientProfilePage
      client={profileData.client}
      companyPricing={profileData.companyPricing}
      initialDiets={profileData.initialDiets}
      initialTrainingPlans={profileData.initialTrainingPlans}
      initialTrainingSessions={profileData.initialTrainingSessions}
      readOnly={isCoach}
      plansReadOnly={isCoach ? false : undefined}
      showDataEntry={isCoach}
      showBreadcrumb={isCoach}
    />
  );
}
