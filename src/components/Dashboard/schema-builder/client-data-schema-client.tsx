"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createMetricDefinitionAction,
  deleteMetricDefinitionAction,
  updateMetricDefinitionAction,
} from "@/app/(app)/dashboard/company/schema/actions";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
import { MetricDefinitionModal } from "@/components/Dashboard/schema-builder/metric-definition-modal";
import { Button } from "@/components/ui-elements/button";
import type { MetricDefinitionFormValues } from "@/types/dashboard/client-metric-definition";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";

type ClientDataSchemaClientProps = {
  initialGroups: FieldGroup[];
  pageTitle?: string;
};

export function ClientDataSchemaClient({
  initialGroups,
  pageTitle = "Client Data Configuration",
}: ClientDataSchemaClientProps) {
  const router = useRouter();
  const [groups, setGroups] = useState(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [defaultGroupName, setDefaultGroupName] = useState("");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingValues, setEditingValues] =
    useState<MetricDefinitionFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGroups(initialGroups);
  }, [initialGroups]);

  const openAddField = (groupName = "") => {
    setModalMode("add");
    setDefaultGroupName(groupName);
    setEditingFieldId(null);
    setEditingValues(null);
    setModalOpen(true);
  };

  const openEditField = (field: SchemaField, groupId: string) => {
    setModalMode("edit");
    setEditingFieldId(field.id);
    setEditingValues({
      label: field.label,
      unit: field.unit ?? "",
      group: groups.find((g) => g.id === groupId)?.name ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async (values: MetricDefinitionFormValues) => {
    setIsSaving(true);

    const result =
      modalMode === "edit" && editingFieldId
        ? await updateMetricDefinitionAction(editingFieldId, values)
        : await createMetricDefinitionAction(values);

    setIsSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(
      modalMode === "edit"
        ? "Field updated successfully"
        : "Field created successfully",
    );
    setModalOpen(false);
    router.refresh();
  };

  const handleDelete = async (fieldId: string) => {
    const result = await deleteMetricDefinitionAction(fieldId);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Field deleted successfully");
    router.refresh();
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle title={pageTitle} className="mb-0" />

        <Button
          type="button"
          label="Add Field"
          size="small"
          variant="primary"
          onClick={() => openAddField()}
        />
      </div>

      {groups.length === 0 ? (
        <p className="rounded-[14px] border border-dashed border-stroke/70 px-4 py-8 text-center text-sm text-dark-6 dark:border-dark-3">
          No fields configured yet. Click &quot;Add Field&quot; to create one.
        </p>
      ) : (
        groups.map((group) => (
          <FieldGroupCard
            key={group.id}
            group={group}
            onAddField={() => openAddField(group.name)}
            onEditField={(field) => openEditField(field, group.id)}
            onDeleteField={handleDelete}
          />
        ))
      )}

      <MetricDefinitionModal
        open={modalOpen}
        mode={modalMode}
        defaultGroup={defaultGroupName}
        values={modalMode === "edit" ? editingValues : null}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
}
