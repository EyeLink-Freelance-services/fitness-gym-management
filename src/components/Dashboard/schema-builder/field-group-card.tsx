import { Button } from "@/components/ui-elements/button";
import { FieldRow } from "@/components/Dashboard/schema-builder/field-row";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";

type FieldGroupCardProps = {
  group: FieldGroup;
  isDirty?: boolean;
  onAddField?: () => void;
  onEditGroup?: () => void;
  onEditField?: (field: SchemaField) => void;
  onResetGroup?: (group: FieldGroup) => void;
  onResetField?: (field: SchemaField, groupId: string) => void;
  isFieldDirty?: (fieldId: string) => boolean;
};

export function FieldGroupCard({
  group,
  isDirty,
  onAddField,
  onEditGroup,
  onEditField,
  onResetGroup,
  onResetField,
  isFieldDirty,
}: FieldGroupCardProps) {
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

        <div className="flex flex-wrap items-center gap-2">
          {isDirty && (
            <Button
              type="button"
              label="Reset Group"
              size="small"
              variant="dark"
              onClick={() => onResetGroup?.(group)}
            />
          )}
          {onEditGroup && (
            <Button
              type="button"
              label="Edit group"
              size="small"
              variant="outlineDark"
              onClick={onEditGroup}
            />
          )}
          <Button
            type="button"
            label="+ Field"
            size="small"
            variant="outlineDark"
            onClick={onAddField}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {group.fields.map((field) => (
          <FieldRow
            key={field.id}
            field={field}
            isDirty={isFieldDirty?.(field.id)}
            onEdit={onEditField ? () => onEditField(field) : undefined}
            onResetField={() => onResetField?.(field, group.id)}
          />
        ))}
      </div>
    </section>
  );
}
