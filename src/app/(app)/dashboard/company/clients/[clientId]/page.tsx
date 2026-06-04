import { notFound } from "next/navigation";
import { getCompanyClientAction } from "@/app/(app)/dashboard/company/clients/actions";
import { ClientProfilePage } from "@/components/Dashboard/company/client-profile/client-profile-page";
import { getCompanyPricingForCompany } from "@/modules/company/company.service";

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

  return <ClientProfilePage client={client} companyPricing={companyPricing} />;
}
