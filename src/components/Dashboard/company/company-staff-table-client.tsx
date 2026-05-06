"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { companyStaffColumns } from "@/components/Dashboard/table-column/company-columns";
import StaffForm from "@/components/Forms/StaffForm";
import { DataTable } from "@/components/Tables";
import type { CompanyStaffRow } from "@/types/dashboard/company";
import { StaffFormData } from "@/types/forms";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

interface CompanyStaffTableClientProps {
  data: CompanyStaffRow[];
}

export function CompanyStaffTableClient({
  data,
}: CompanyStaffTableClientProps) {
  const [selectedStaff, setSelectedStaff] = useState<CompanyStaffRow | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedStaff) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedStaff(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedStaff]);

  const selectedStaffFormData: StaffFormData | undefined = selectedStaff
    ? {
        gymBranch: selectedStaff.gym_name,
        firstName: selectedStaff.first_name,
        lastName: selectedStaff.last_name,
        contactNumber: selectedStaff.phone_num,
        email: selectedStaff.email,
        role: selectedStaff.role,
        notes: selectedStaff.notes,
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger buttonLabel="+ Add Staff" formType="staff" />
        </div>

        <DataTable
          title="Staff"
          description="Staff records from the company."
          data={data}
          columns={companyStaffColumns}
          getRowId={(row) => row.id}
          tableClassName="min-w-[720px]"
          searchPlaceholder="Search staff name, contact..."
          initialPageSize={8}
          onRowClick={setSelectedStaff}
          emptyStateLabel="No staff available."
        />
      </div>

      {selectedStaff &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedStaff(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <StaffForm
                  mode="edit"
                  initialData={selectedStaffFormData}
                  onSuccess={() => setSelectedStaff(null)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
