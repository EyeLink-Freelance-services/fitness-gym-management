"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import PersonalCoachForm from "@/components/Forms/PersonalCoachForm";
import { DataTable } from "@/components/Tables";
import type { CompanyCoachRow } from "@/types/dashboard/company-directory";
import type { PersonalCoachFormData } from "@/types/forms";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { companyCoachColumns } from "../table-column/company-columns";

interface CompanyCoachesTableClientProps {
  data: CompanyCoachRow[];
}

export function CompanyCoachesTableClient({
  data,
}: CompanyCoachesTableClientProps) {
  const [selectedCoach, setSelectedCoach] = useState<CompanyCoachRow | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedCoach) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCoach(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCoach]);

  const selectedCoachFormData: PersonalCoachFormData | undefined = selectedCoach
    ? {
        firstName: selectedCoach.first_name,
        lastName: selectedCoach.last_name,
        contactNumber: selectedCoach.phone_num,
        email: selectedCoach.email,
        specialization: selectedCoach.specialization,
        coachingMode: selectedCoach.coaching_mode,
        location: selectedCoach.location,
        certifications: selectedCoach.certifications?.join(", ") ?? "",
        hourlyRate: selectedCoach.hourly_rate,
        yearsExperience: selectedCoach.years_of_experience,
        languages: selectedCoach.languages_spoken?.join(", ") ?? "",
        bio: selectedCoach.bio,
        availability: selectedCoach.availability?.join(", ") ?? "",
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Add Coach"
            formType="personal"
            coachContext="company"
            size="small"
          />
        </div>

        <DataTable
          title="Coaches"
          description="Coach availability and their number of clients."
          data={data}
          columns={companyCoachColumns}
          getRowId={(row) => row.id}
          onRowClick={setSelectedCoach}
          tableClassName="min-w-[860px]"
          searchPlaceholder="Search coach, email, status..."
          initialPageSize={10}
          emptyStateLabel="No coaches available."
        />
      </div>

      {selectedCoach &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedCoach(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <PersonalCoachForm
                  context="company"
                  mode="edit"
                  initialData={selectedCoachFormData}
                  existingProfilePhotoUrl={
                    selectedCoach.profile_photo ?? undefined
                  }
                  onSuccess={() => setSelectedCoach(null)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
