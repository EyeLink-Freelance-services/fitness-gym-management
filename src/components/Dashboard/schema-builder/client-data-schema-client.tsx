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

function normalizeField(field: SchemaField) {
  return {
    id: field.id,
    groupId: field.groupId,
    label: field.label,
    key: field.key,
    type: field.type,
    unit: field.unit ?? "",
    placeholder: field.placeholder ?? "",
    description: field.description ?? "",
    required: field.required,
    readOnly: field.readOnly ?? false,
    showPortal: field.showPortal ?? false,
    archived: field.archived ?? false,
    sortOrder: field.sortOrder,
    options: (field.options ?? []).map((option) => ({
      label: option.label,
      value: option.value,
    })),
    validation: {
      min: field.validation?.min ?? null,
      max: field.validation?.max ?? null,
      pattern: field.validation?.pattern ?? "",
      helperText: field.validation?.helperText ?? "",
    },
  };
}

function normalizeGroup(group: FieldGroup) {
  return {
    id: group.id,
    name: group.name,
    description: group.description ?? "",
    accentColor: group.accentColor ?? "",
    iconKey: group.iconKey ?? "",
    unitHint: group.unitHint ?? "",
    sortOrder: group.sortOrder,
    fields: [...group.fields]
      .map(normalizeField)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function normalizeGroups(groups: FieldGroup[]) {
  return groups
    .map(normalizeGroup)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

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

  const showSaveResetChangesBtn = useMemo(() => {
    const current = JSON.stringify(normalizeGroups(groups));
    const initial = JSON.stringify(normalizeGroups(initialGroups));

    return current !== initial;
  }, [groups, initialGroups]);

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

  const getInitialGroupById = (groupId: string) => {
    return initialGroups.find((g) => g.id === groupId);
  };

  const getCurrentGroupById = (groupId: string) => {
    return groups.find((g) => g.id === groupId);
  };

  const getInitialFieldById = (fieldId: string) => {
    for (const group of initialGroups) {
      const field = group.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
    return undefined;
  };

  const getCurrentFieldById = (fieldId: string) => {
    for (const group of groups) {
      const field = group.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
    return undefined;
  };

  const isGroupDirty = (groupId: string) => {
    const currentGroup = getCurrentGroupById(groupId);
    const initialGroup = getInitialGroupById(groupId);

    // Newly added group
    if (currentGroup && !initialGroup) return true;

    // Deleted group (future-safe)
    if (!currentGroup && initialGroup) return true;

    if (!currentGroup || !initialGroup) return false;

    return (
      JSON.stringify(normalizeGroup(currentGroup)) !==
      JSON.stringify(normalizeGroup(initialGroup))
    );
  };

  const isFieldDirty = (fieldId: string) => {
    const currentField = getCurrentFieldById(fieldId);
    const initialField = getInitialFieldById(fieldId);

    // Newly added field
    if (currentField && !initialField) return true;

    // Deleted field (future-safe)
    if (!currentField && initialField) return true;

    if (!currentField || !initialField) return false;

    return (
      JSON.stringify(normalizeField(currentField)) !==
      JSON.stringify(normalizeField(initialField))
    );
  };

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

  const onResetGroup = (group: FieldGroup) => {
    const initialGroup = getInitialGroupById(group.id);

    setGroups((prev) => {
      // If group did not exist initially, it was newly added -> remove it
      if (!initialGroup) {
        return prev.filter((g) => g.id !== group.id);
      }

      // Otherwise restore original group
      return prev.map((g) => (g.id === group.id ? initialGroup : g));
    });
  }


  const onResetField = (field: SchemaField, groupId: string) => {
    const initialGroupContainingField = initialGroups.find((g) =>
      g.fields.some((f) => f.id === field.id),
    );

    const initialField = initialGroupContainingField?.fields.find(
      (f) => f.id === field.id,
    );

    setGroups((prev) => {
      // Remove this field from all current groups first
      const stripped = prev.map((g) => ({
        ...g,
        fields: g.fields.filter((f) => f.id !== field.id),
      }));

      // If field did not exist initially, it was newly added -> just remove it
      if (!initialField || !initialGroupContainingField) {
        return stripped;
      }

      // Restore field to its original group
      return stripped.map((g) => {
        if (g.id !== initialGroupContainingField.id) return g;

        return {
          ...g,
          fields: [...g.fields, initialField].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          ),
        };
      });
    });
  }

  const onResetChanges = () => {
    setGroups(initialGroups);
  }

  const onSaveChanges = () => {
    const current = JSON.stringify(normalizeGroups(groups))
    console.log(current, 'current');
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <CardTitle title={pageTitle} className="mb-0" />
        <div className="flex gap-3">
          { showSaveResetChangesBtn &&
            <div className="flex gap-3">
              <Button
                type="button"
                size="small"
                variant="dark"
                label="Reset Changes"
                onClick={onResetChanges}
              />
              <Button
                type="button"
                size="small"
                variant="primary"
                label="Save Changes"
                onClick={onSaveChanges}
              />
            </div>
          }
          <Button
            type="button"
            size="small"
            variant="outlinePrimary"
            label="+ Group"
            onClick={openAddGroup}
          />
        </div>
      </div>

      {groups.map((group) => (
        <FieldGroupCard
          key={group.id}
          group={group}
          isDirty={isGroupDirty(group.id)}
          onAddField={() => openAddField(group.id)}
          onEditGroup={() => openEditGroup(group)}
          onEditField={(field) => openEditField(field, group.id)}
          onResetGroup={() => onResetGroup(group)}
          onResetField={(field) => onResetField(field, group.id)}
          isFieldDirty={isFieldDirty}
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
