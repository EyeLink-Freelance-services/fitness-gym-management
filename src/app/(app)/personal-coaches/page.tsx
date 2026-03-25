import { CoachesTableClient } from "@/components/Dashboard/super-admin/coaches-table-client";
import { getAllCoaches } from "@/services/dashboard.services";

export default async function SuperAdminCoachesPage() {
  const allCoaches = await getAllCoaches();

  return <CoachesTableClient data={allCoaches} />;
}
