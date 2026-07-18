"use client";

import { FormModalShell } from "@/components/Dashboard/form-modal-shell";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import {
  companyClientCoachAssignmentColumns,
} from "@/components/Dashboard/table-column/company-columns";
import AssignClientForm from "@/components/Forms/AssignClientForm";
import { DataTable } from "@/components/Tables";
import type { CompanyClient } from "@/types/dashboard/company";
import type { AssignClientFormData, AssignClientStatus } from "@/types/forms";
import { useMounted } from "@/hooks/use-mounted";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

interface CompanyClientCoachAssignTableClientProps {
  data: CompanyClient[];
}

function normalizeAssignmentStatus(
  assignment: CompanyClient,
): AssignClientStatus {
  const normalizedStatus = assignment.status?.trim().toLowerCase();

  if (
    normalizedStatus === "assigned" ||
    normalizedStatus === "pending" ||
    normalizedStatus === "unassigned"
  ) {
    return normalizedStatus;
  }

  return assignment.coachId ? "assigned" : "unassigned";
}

export function CompanyClientCoachAssignTableClient({
  data,
}: CompanyClientCoachAssignTableClientProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<CompanyClient | null>(null);
  const mounted = useMounted();
  const titleId = useId();

  useEffect(() => {
    if (!selectedAssignment) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAssignment(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedAssignment]);

  const selectedAssignmentFormData: AssignClientFormData | undefined =
    selectedAssignment
      ? {
          clientId: selectedAssignment.id,
          coachId:
            selectedAssignment.coachId ??
            "",
          status: normalizeAssignmentStatus(selectedAssignment),
        }
      : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Assign Client"
            formType="assignClient"
            size="small"
          />
        </div>

        <DataTable
          title="Client Coach Assignments"
          description="Assign clients to coaches and update assignment status."
          data={data}
          columns={companyClientCoachAssignmentColumns}
          getRowId={(row) => row.id}
          onRowClick={setSelectedAssignment}
          tableClassName="min-w-[980px]"
          searchPlaceholder="Search client, contact, plan, coach..."
          initialPageSize={10}
          emptyStateLabel="No client assignments available."
        />
      </div>

      {selectedAssignment &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedAssignment(null);
              }
            }}
          >
            <FormModalShell onClose={() => setSelectedAssignment(null)}>
              <AssignClientForm
                mode="edit"
                initialData={selectedAssignmentFormData}
                onSuccess={() => setSelectedAssignment(null)}
              />
            </FormModalShell>
          </div>,
          document.body,
        )}
    </>
  );
}
