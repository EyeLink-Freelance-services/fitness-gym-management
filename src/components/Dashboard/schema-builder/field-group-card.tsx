import { Button } from "@/components/ui-elements/button";
import { FieldRow } from "@/components/Dashboard/schema-builder/field-row";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";

type FieldGroupCardProps = {
  group: FieldGroup;
  onAddField: () => void;
  onEditField: (field: SchemaField) => void;
  onDeleteField: (fieldId: string) => void;
};

export function FieldGroupCard({
  group,
  onAddField,
  onEditField,
  onDeleteField,
}: FieldGroupCardProps) {
  return (
    <section className="mb-3 rounded-[14px] border border-stroke/70 bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-body-lg font-bold text-dark dark:text-white">
            {group.name}
          </h3>
          <span className="text-xs uppercase tracking-[0.18em] text-dark-5">
            {group.fields.length} fields
          </span>
        </div>

        <Button
          type="button"
          label="+ Field"
          size="small"
          variant="outlineDark"
          onClick={onAddField}
        />
      </div>

      <div className="grid gap-3">
        {group.fields.map((field) => (
          <FieldRow
            key={field.id}
            field={field}
            onEdit={() => onEditField(field)}
            onDelete={() => onDeleteField(field.id)}
          />
        ))}
      </div>
    </section>
  );
}
