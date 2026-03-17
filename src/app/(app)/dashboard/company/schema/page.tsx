import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
import { SchemaSummaryCard } from "@/components/Dashboard/schema-builder/schema-summary-card";
import { SchemaValidationCard } from "@/components/Dashboard/schema-builder/schema-validation-card";
import { Button } from "@/components/ui-elements/button";
import {
  getCompanyFieldGroups,
  getCompanySchemaOverview,
  getCompanySchemaValidationRules,
} from "@/services/coach-schema.services";

export default async function CompanySchemaPage() {
  const [summary, groups, rules] = await Promise.all([
    getCompanySchemaOverview(),
    getCompanyFieldGroups(),
    getCompanySchemaValidationRules(),
  ]);

  const { totalFields, totalFormulas, linkedClients } = summary;

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
        <div className="flex items-center justify-between gap-3">
            <CardTitle title="Client Data Configuration" className="mb-0" />

            <Button
              size="small"
              variant="outlinePrimary"
              label="+ Group"
              toastMessage="To configure"
            />
          </div>
          {groups.map((group) => (
            <FieldGroupCard key={group.id} group={group} />
          ))}
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
