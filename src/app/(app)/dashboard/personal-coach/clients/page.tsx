import { ClientCardsGrid } from "@/components/Dashboard/client-records/client-cards-grid";
import { getPersonalCoachClients } from "@/services/coach-schema.services";

export default async function PersonalCoachClientsPage() {
  const clients = await getPersonalCoachClients();

  return (
    <div>
      <ClientCardsGrid clients={clients} />
    </div>
  );
}
