import { ClientDataSchemaClient } from "@/components/Dashboard/schema-builder/client-data-schema-client";
import { SchemaSummaryCard } from "@/components/Dashboard/schema-builder/schema-summary-card";
import {
  getCompanyFieldGroups,
  getCompanySchemaOverview,
} from "@/services/coach-schema.services";

export default async function CompanySchemaPage() {
  const [summary, groups] = await Promise.all([
    getCompanySchemaOverview(),
    getCompanyFieldGroups(),
  ]);

  const { totalFields, totalFormulas, linkedClients } = summary;

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <ClientDataSchemaClient initialGroups={groups} />
        </div>

        <div className="flex flex-col gap-6">
          <SchemaSummaryCard
            totalFields={totalFields}
            totalFormulas={totalFormulas}
            linkedClients={linkedClients}
          />
        </div>
      </div>
    </div>
  );
}
