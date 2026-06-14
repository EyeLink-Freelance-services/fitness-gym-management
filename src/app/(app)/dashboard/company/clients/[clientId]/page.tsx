import { notFound } from "next/navigation";
import { fetchClientDietsPage } from "@/app/(app)/dashboard/company/clients/client-diet-actions";
import { fetchClientTrainingPlansPage } from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
import { getCompanyClientAction } from "@/app/(app)/dashboard/company/clients/actions";
import { ClientProfilePage } from "@/components/Dashboard/company/client-profile/client-profile-page";
import { getCompanyPricingForCompany } from "@/services/company/company.service";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientProfileRoute({ params }: Props) {
  const { clientId } = await params;

  const [client, companyPricing] = await Promise.all([
    getCompanyClientAction(clientId),
    getCompanyPricingForCompany().catch(() => null),
  ]);

  if (!client) {
    notFound();
  }

  const isPersonalCoaching = client.membershipPlan === "PERSONAL";
  const [initialDietsResult, initialTrainingPlansResult] = isPersonalCoaching
    ? await Promise.all([
        fetchClientDietsPage(clientId, 0, 100).catch(() => ({
          diets: [],
        })),
        fetchClientTrainingPlansPage(clientId, 0, 100).catch(() => ({
          trainingPlans: [],
        })),
      ])
    : [{ diets: [] }, { trainingPlans: [] }];

  return (
    <ClientProfilePage
      client={client}
      companyPricing={companyPricing}
      initialDiets={initialDietsResult.diets}
      initialTrainingPlans={initialTrainingPlansResult.trainingPlans}
    />
  );
}
