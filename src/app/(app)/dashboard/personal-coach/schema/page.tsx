import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
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

  return (
    <div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                Field Groups & Variables
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="rounded-[10px] border border-stroke px-4 py-2 text-sm text-dark-6 dark:border-dark-3 dark:text-dark-5">
                + Group
              </button>
              <button className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white">
                + Field
              </button>
            </div>
          </div>
          {groups.map((group) => (
            <FieldGroupCard key={group.id} group={group} />
          ))}
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
              <div className="text-3xl font-bold text-primary">
                {summary.totalFields}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-dark-5">
                Fields
              </div>
            </div>
            <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
              <div className="text-3xl font-bold text-green">
                {summary.totalFormulas}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-dark-5">
                Formulas
              </div>
            </div>
            <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
              <div className="text-3xl font-bold text-[#FFBF47]">
                {summary.activeVersion}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-dark-5">
                Version
              </div>
            </div>
            <div className="rounded-[14px] border border-stroke/70 bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
              <div className="text-3xl font-bold text-purple-300">
                {summary.linkedClients}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-dark-5">
                Clients
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Validation Rules
            </h3>
            <div className="mt-4 grid gap-3 text-sm">
              {rules.map((rule) => (
                <div key={rule.id}>
                  <div className="font-medium text-dark dark:text-white">
                    {rule.title}
                  </div>
                  <div className="mt-1 text-dark-6 dark:text-dark-5">
                    {rule.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Version Log
            </h3>
            <div className="mt-4 grid gap-3">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="rounded-[10px] border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-dark dark:text-white">
                      {version.version}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        version.isActive
                          ? "bg-green/10 text-green"
                          : "bg-dark-2 text-dark-6 dark:bg-dark-3 dark:text-dark-5"
                      }`}
                    >
                      {version.isActive ? "Current" : "History"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dark-6 dark:text-dark-5">
                    {version.note}
                  </p>
                  <div className="mt-3 grid gap-1 text-xs text-dark-5">
                    <span>{version.fieldCount} fields</span>
                    <span>{version.formulaCount} formulas</span>
                    <span>{version.linkedClients} linked clients</span>
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
