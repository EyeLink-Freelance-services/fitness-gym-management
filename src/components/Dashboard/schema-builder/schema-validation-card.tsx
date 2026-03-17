import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import type { SchemaValidationRuleSummary } from "@/types/dashboard/coach-schema";

type SchemaValidationCardProps = {
  rules: SchemaValidationRuleSummary[];
};

export function SchemaValidationCard({ rules }: SchemaValidationCardProps) {
  return (
    <div className="rounded-xl border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card md:h-fit">
      <CardTitle title="Validation Rules" />

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
  );
}
