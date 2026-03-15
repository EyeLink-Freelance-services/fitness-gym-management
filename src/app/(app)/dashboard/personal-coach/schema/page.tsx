import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
import { Button } from "@/components/ui-elements/button";
import {
  getPersonalCoachFieldGroups,
  getPersonalCoachSchemaOverview,
  getPersonalCoachSchemaValidationRules,
  getPersonalCoachSchemaVersions,
} from "@/services/coach-schema.services";

export default async function PersonalCoachSchemaPage() {
  const [summary, groups, rules, versions] = await Promise.all([
    getPersonalCoachSchemaOverview(),
    getPersonalCoachFieldGroups(),
    getPersonalCoachSchemaValidationRules(),
    getPersonalCoachSchemaVersions(),
  ]);

  const { totalFields, totalFormulas, linkedClients } = summary;

  const summaryItems = [
    {
      label: "Total Fields",
      value: totalFields,
      color: "text-primary",
    },
    {
      label: "Total Formulas",
      value: totalFormulas,
      color: "text-[#FFBF47]",
    },
    {
      label: "Linked Clients",
      value: linkedClients,
      color: "text-green",
    },
  ];

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
          <div className="rounded-xl border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card md:h-fit">
            <CardTitle title="Summary" />

            <div className="grid gap-2 sm:grid-cols-2">
              {summaryItems.map((summaryItem) => (
                <div
                  key={summaryItem.label}
                  className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/50"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
                    {summaryItem.label}
                  </p>
                  <p
                    className={`mt-2 text-[15px] font-bold ${summaryItem.color}`}
                  >
                    {summaryItem.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <CardTitle title="Validation Rules" />
            <div className="mt-4 grid gap-3 text-sm">
              {rules.map((rule) => (
                <div key={rule.id}>
                  <div className="font-medium text-dark dark:text-white">
                    {rule.title}
                  </div>
                  <div className="mt-1 text-dark-6 dark:text-dark-6">
                    {rule.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
