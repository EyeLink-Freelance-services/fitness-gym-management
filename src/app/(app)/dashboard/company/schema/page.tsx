import { ClientDataSchemaClient } from "@/components/Dashboard/schema-builder/client-data-schema-client";
import { getClientMetricDefinitionFieldGroups } from "@/services/company/client-metric-definition.service";

export default async function CompanySchemaPage() {
  const groups = await getClientMetricDefinitionFieldGroups();

  return (
    <div>
      <ClientDataSchemaClient initialGroups={groups} />
    </div>
  );
}
