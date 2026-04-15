import { CoachesTableClient } from "@/components/Dashboard/super-admin/coaches-table-client";
import { findAllPersonalCoaches } from "@/modules/personal-coach/personal-coach.service";

export default async function SuperAdminCoachesPage() {
  const allCoaches = await findAllPersonalCoaches();

  return <CoachesTableClient data={allCoaches} />;
}
