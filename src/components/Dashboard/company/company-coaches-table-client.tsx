"use client";

import { fetchCompanyCoachPage } from "@/app/(app)/dashboard/company/coaches/actions";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import CoachForm from "@/components/Forms/CoachForm";
import { companyCoachColumns } from "@/components/Dashboard/table-column/company-columns";
import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { mapCompanyCoachesRowToFormValues } from "@/modules/company/company-coach.mappers";
import type {
  CompanyCoachesRow,
  CompanyCoachesTableClientProps,
} from "@/types/dashboard/company";
import { useRouter } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

export function CompanyCoachesTableClient({
  initialData,
  totalCount,
}: CompanyCoachesTableClientProps) {
  const router = useRouter();
  const [selectedCoach, setSelectedCoach] = useState<CompanyCoachesRow | null>(
    null,
  );
  const mounted = useMounted();
  const titleId = useId();

  const pagination = usePagination({
    initialData,
    initialTotalCount: totalCount,
    pageSize: 10,
    fetchFn: async (pageNumber, pageSize, search) => {
      const { coaches, totalCount } = await fetchCompanyCoachPage(
        pageNumber,
        pageSize,
        search,
      );
      return {
        data: coaches,
        totalCount,
      };
    },
  });

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

  const handleCoachSuccess = () => {
    setSelectedCoach(null);
    void pagination.refetchCurrentPage();
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Add Coach"
            formType="coach"
            size="small"
            onSuccess={() => {
              void pagination.refetchCurrentPage();
              router.refresh();
            }}
          />
        </div>

        <DataTable
          title="Coaches"
          description="Coach availability and their number of clients."
          data={pagination.data}
          columns={companyCoachColumns}
          getRowId={(row) => row.id}
          onRowClick={setSelectedCoach}
          tableClassName="min-w-[860px]"
          searchPlaceholder="Search coach, email, location..."
          searchValue={pagination.search}
          onSearchChange={pagination.setSearch}
          initialPageSize={10}
          emptyStateLabel="No coaches available."
          showFooter={false}
        />

        <div className="mt-5 flex flex-col gap-3 border-t border-stroke pt-4 text-sm dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="shrink-0 whitespace-nowrap text-dark-6 dark:text-dark-6">
            Showing {pagination.data.length} of {pagination.totalCount} result
            {pagination.totalCount === 1 ? "" : "s"}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <span className="shrink-0 whitespace-nowrap text-dark-6 dark:text-dark-6">
              Page {pagination.currentPage + 1} of{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                label="Previous"
                size="small"
                variant="outlineDark"
                onClick={pagination.previousPage}
                disabled={!pagination.canGoPrevious || pagination.isLoading}
                className={cn(
                  (!pagination.canGoPrevious || pagination.isLoading) &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent",
                )}
              />
              <Button
                type="button"
                label="Next"
                size="small"
                variant="outlineDark"
                onClick={pagination.nextPage}
                disabled={!pagination.canGoNext || pagination.isLoading}
                className={cn(
                  (!pagination.canGoNext || pagination.isLoading) &&
                    "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent",
                )}
              />
            </div>
          </div>
        </div>
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
                <CoachForm
                  mode="edit"
                  coachId={selectedCoach.id}
                  initialData={mapCompanyCoachesRowToFormValues(selectedCoach)}
                  existingProfilePhotoUrl={
                    selectedCoach.profile_photo ?? undefined
                  }
                  onSuccess={handleCoachSuccess}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
