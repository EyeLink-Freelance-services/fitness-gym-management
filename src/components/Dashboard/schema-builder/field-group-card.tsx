import { Button } from "@/components/ui-elements/button";
import { FieldRow } from "@/components/Dashboard/schema-builder/field-row";
import type { FieldGroup } from "@/types/dashboard/coach-schema";

type FieldGroupCardProps = {
  group: FieldGroup;
};

export function FieldGroupCard({ group }: FieldGroupCardProps) {
  return (
    <section className="rounded-[14px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-body-lg font-bold text-dark dark:text-white">
              {group.name}
            </h3>
            <span className="text-xs uppercase tracking-[0.18em] text-dark-5">
              {group.fields.length} fields{" "}
              {group.unitHint ? `· ${group.unitHint}` : ""}
            </span>
          </div>
          {group.description && (
            <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
              {group.description}
            </p>
          )}
        </div>

        <Button
          label="+ Field"
          size="small"
          variant="outlineDark"
          toastMessage="Field editing is prepared for phase 2."
        />
      </div>

      <div className="grid gap-3">
        {group.fields.map((field) => (
          <FieldRow key={field.id} field={field} />
        ))}
        <button
          type="button"
          className="rounded-[10px] border border-dashed border-dark-3 px-4 py-3 text-left text-sm text-dark-5 transition-colors hover:border-primary hover:text-primary"
        >
          + Add field to this group
        </button>
      </div>
    </section>
  );
}
