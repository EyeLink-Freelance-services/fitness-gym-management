import { ClientDataSchemaClient } from "@/components/Dashboard/schema-builder/client-data-schema-client";
import { SchemaSummaryCard } from "@/components/Dashboard/schema-builder/schema-summary-card";
import { SchemaValidationCard } from "@/components/Dashboard/schema-builder/schema-validation-card";
import { getSchemaPageDataAction } from "./actions";
import { FullSchema } from "@/types/dashboard";

export default async function CompanySchemaPage() {
  const res = await getSchemaPageDataAction();

  console.log(res, 'res')

  const { summary, groups, rules, mode } = res.data as FullSchema;
  const { totalFields, totalFormulas, linkedClients } = summary;

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <ClientDataSchemaClient
            initialGroups={groups}
            mode={mode}
          />
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