import { ClientDataSchemaClient } from "@/components/Dashboard/schema-builder/client-data-schema-client";
import { SchemaSummaryCard } from "@/components/Dashboard/schema-builder/schema-summary-card";
import { SchemaValidationCard } from "@/components/Dashboard/schema-builder/schema-validation-card";
import {
  getPersonalCoachFieldGroups,
  getPersonalCoachSchemaOverview,
  getPersonalCoachSchemaValidationRules,
} from "@/services/coach-schema.services";

export default async function PersonalCoachSchemaPage() {
  const [summary, groups, rules] = await Promise.all([
    getPersonalCoachSchemaOverview(),
    getPersonalCoachFieldGroups(),
    getPersonalCoachSchemaValidationRules(),
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

          <SchemaValidationCard rules={rules} />
        </div>
      </div>
    </div>
  );
}
