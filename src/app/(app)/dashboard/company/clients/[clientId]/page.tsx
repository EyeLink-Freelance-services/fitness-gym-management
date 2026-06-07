import { notFound } from "next/navigation";
import {
  fetchCompanyClientDietPlansAction,
  fetchCompanyClientTrainingPlansAction,
} from "@/app/(app)/dashboard/company/clients/client-coaching-actions";
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
  const [initialDietPlans, initialTrainingPlans] = isPersonalCoaching
    ? await Promise.all([
        fetchCompanyClientDietPlansAction(clientId),
        fetchCompanyClientTrainingPlansAction(clientId),
      ])
    : [[], []];

  return (
    <ClientProfilePage
      client={client}
      companyPricing={companyPricing}
      initialDietPlans={initialDietPlans}
      initialTrainingPlans={initialTrainingPlans}
    />
  );
}
