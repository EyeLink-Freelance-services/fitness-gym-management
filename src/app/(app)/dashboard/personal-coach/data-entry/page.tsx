import { PersonalCoachDataEntry } from "@/components/Dashboard/personal-coach/data-entry";
import {
  getPersonalCoachFormulas,
  getPersonalCoachRecordDraft,
} from "@/services/coach-schema.services";

type PageProps = {
  searchParams: Promise<{ clientId?: string }>;
};

export default async function PersonalCoachDataEntryPage({
  searchParams,
}: PageProps) {
  const { clientId } = await searchParams;
  const [draft, formulas] = await Promise.all([
    getPersonalCoachRecordDraft(clientId),
    getPersonalCoachFormulas(),
  ]);

  return <PersonalCoachDataEntry draft={draft} formulas={formulas} />;
}
