import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";

type SchemaSummaryCardProps = {
  totalFields: number;
  totalFormulas: number;
  linkedClients: number;
};

const SUMMARY_ITEMS = [
  { label: "Total Fields", color: "text-primary", key: "totalFields" },
  {
    label: "Total Formulas",
    color: "text-[#FFBF47]",
    key: "totalFormulas",
  },
  {
    label: "Linked Clients",
    color: "text-green",
    key: "linkedClients",
  },
] as const;

export function SchemaSummaryCard({
  totalFields,
  totalFormulas,
  linkedClients,
}: SchemaSummaryCardProps) {
  const values = { totalFields, totalFormulas, linkedClients };

  return (
    <div className="rounded-xl border border-stroke/70 bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card md:h-fit">
      <CardTitle title="Summary" />

      <div className="grid gap-2 sm:grid-cols-2">
        {SUMMARY_ITEMS.map((item) => (
          <div
            key={item.label}
            className="rounded-[8px] border border-stroke/70 bg-dark-2/20 p-3 dark:border-dark-3 dark:bg-dark-2/50"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-5 dark:text-dark-6">
              {item.label}
            </p>
            <p className={`mt-2 text-[15px] font-bold ${item.color}`}>
              {values[item.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
