"use client";

import { useMemo, useState } from "react";
import CardTitle from "@/components/Dashboard/overview-cards/cardTitle";
import { FieldGroupCard } from "@/components/Dashboard/schema-builder/field-group-card";
import { SchemaFieldModal } from "@/components/Dashboard/schema-builder/schema-field-modal";
import { SchemaGroupModal } from "@/components/Dashboard/schema-builder/schema-group-modal";
import { Button } from "@/components/ui-elements/button";
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

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"add" | "edit">("add");
  const [editingGroup, setEditingGroup] = useState<FieldGroup | null>(null);

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

  const nextGroupSortOrder = useMemo(
    () =>
      groups.length === 0
        ? 10
        : Math.max(...groups.map((g) => g.sortOrder)) + 10,
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

  const openAddGroup = () => {
    setGroupModalMode("add");
    setEditingGroup(null);
    setGroupModalOpen(true);
  };

  const openEditGroup = (g: FieldGroup) => {
    setGroupModalMode("edit");
    setEditingGroup(g);
    setGroupModalOpen(true);
  };

  const handleSaveGroup = (next: FieldGroup) => {
    if (groupModalMode === "add") {
      setGroups((prev) => [...prev, next]);
    } else {
      setGroups((prev) =>
        prev.map((g) => (g.id === next.id ? next : g)),
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <CardTitle title={pageTitle} className="mb-0" />

        <Button
          type="button"
          size="small"
          variant="outlinePrimary"
          label="+ Group"
          onClick={openAddGroup}
        />
      </div>

      {groups.map((group) => (
        <FieldGroupCard
          key={group.id}
          group={group}
          onAddField={() => openAddField(group.id)}
          onEditGroup={() => openEditGroup(group)}
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

      <SchemaGroupModal
        open={groupModalOpen}
        mode={groupModalMode}
        group={editingGroup}
        nextSortOrder={nextGroupSortOrder}
        onClose={() => setGroupModalOpen(false)}
        onSave={handleSaveGroup}
      />
    </>
  );
}
