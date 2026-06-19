"use client";

import { useMemo, useState } from "react";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
import { SchemaFieldModal } from "@/components/Dashboard/schema-builder/schema-field-modal";
import type { FieldGroup, SchemaField } from "@/types/dashboard/coach-schema";

type ClientDataSchemaClientProps = {
  initialGroups: FieldGroup[];
  pageTitle?: string;
};

export function ClientDataSchemaClient({
  initialGroups,
  pageTitle = "Client Data Configuration",
}: ClientDataSchemaClientProps) {
  const [groups, setGroups] = useState<FieldGroup[]>(initialGroups);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalGroupId, setModalGroupId] = useState(
    () => initialGroups[0]?.id ?? "",
  );
  const [editingField, setEditingField] = useState<SchemaField | null>(null);

  const existingKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const g of groups) {
      for (const f of g.fields) {
        keys.add(f.key);
      }
    }
    return keys;
  }, [groups]);

  const groupOptions = useMemo(
    () => groups.map((g) => ({ id: g.id, name: g.name })),
    [groups],
  );

  const openAddField = (groupId: string) => {
    setModalMode("add");
    setModalGroupId(groupId);
    setEditingField(null);
    setModalOpen(true);
  };

  const openEditField = (field: SchemaField, groupId: string) => {
    setModalMode("edit");
    setModalGroupId(groupId);
    setEditingField(field);
    setModalOpen(true);
  };

  const handleSaveField = (next: SchemaField) => {
    const removeId = editingField?.id;
    setGroups((prev) => {
      const stripped = prev.map((g) => ({
        ...g,
        fields: removeId
          ? g.fields.filter((f) => f.id !== removeId)
          : g.fields,
      }));
      return stripped.map((g) => {
        if (g.id !== next.groupId) return g;
        const maxOrder = Math.max(0, ...g.fields.map((f) => f.sortOrder));
        const sortOrder =
          modalMode === "edit" && editingField
            ? editingField.sortOrder
            : maxOrder + 10;
        return {
          ...g,
          fields: [...g.fields, { ...next, sortOrder }],
        };
      });
    });
  };

  return (
    <>
      <CardTitle title={pageTitle} className="mb-0" />

      {groups.map((group) => (
        <FieldGroupCard
          key={group.id}
          group={group}
          onAddField={() => openAddField(group.id)}
          onEditField={(field) => openEditField(field, group.id)}
        />
      ))}

      <SchemaFieldModal
        open={modalOpen}
        mode={modalMode}
        groups={groupOptions}
        defaultGroupId={modalGroupId}
        field={editingField}
        existingKeys={existingKeys}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveField}
      />
    </>
  );
}
