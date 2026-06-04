"use client";

import { DataTable } from "@/components/Tables";
import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { SuperAdminCompanyRow } from "@/types/dashboard/super-admin";
import { superAdminCompanyColumns } from "@/components/Dashboard/table-column/super-admin-column";
import { useEffect, useId, useState } from "react";
import { CompanyFormData } from "@/types/forms";
import { createPortal } from "react-dom";
import CompanyForm from "@/components/Forms/CompanyForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { fetchCompaniesPage } from "@/app/(app)/dashboard/super-admin/company/actions";
import { CompanyTableClientProps } from "@/types/dashboard/company";

export default function CompanyTableClient({
  initialData,
  totalCount,
}: CompanyTableClientProps) {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] =
    useState<SuperAdminCompanyRow | null>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const pagination = usePagination({
    initialData,
    initialTotalCount: totalCount,
    pageSize: 10,
    fetchFn: async (pageNumber, pageSize) => {
      const { companies, totalCount } = await fetchCompaniesPage(
        pageNumber,
        pageSize,
      );
      return {
        data: companies,
        totalCount,
      };
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCompany(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCompany]);

  const selectedCompanyFormData: CompanyFormData | undefined = selectedCompany
    ? {
        companyName: selectedCompany.company_name,
        brn:
          selectedCompany.business_reg_no === "N/A"
            ? ""
            : selectedCompany.business_reg_no.replace(/^BRN-/, ""),
        email: selectedCompany.email,
        contactNumber: selectedCompany.contact_number,
        addressLine1: selectedCompany.address_line_1,
        city: selectedCompany.city,
        postcode: selectedCompany.postcode,
        state: selectedCompany.district,
        branches: selectedCompany.branches.map((branch) => ({
          branchName: branch,
        })),
        standardPrice: selectedCompany.standard_price,
        disclaimer: "N/A",
        agreeTerms: true,
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Add Company"
            formType="company"
            onSuccess={() => {
              void pagination.refetchCurrentPage();
              router.refresh();
            }}
          />
        </div>

        <DataTable
          title="Companies"
          description="Companies across all locations."
          data={pagination.data}
          columns={superAdminCompanyColumns}
          searchPlaceholder="Search company, brn, contact..."
          initialPageSize={10}
          emptyStateLabel="No companies available."
          getRowId={(row) => row.id}
          onRowClick={setSelectedCompany}
          tableClassName="min-w-[760px]"
          showFooter={false}
        />

        {/* Server-Side Pagination */}
        <div className="mt-5 flex items-center justify-between border-t border-stroke pt-4 text-sm dark:border-dark-3">
          <div className="text-dark-6 dark:text-dark-6">
            Showing {pagination.data.length} of {pagination.totalCount} result
            {pagination.totalCount === 1 ? "" : "s"}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-dark-6 dark:text-dark-6">
              Page {pagination.currentPage + 1} of{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>

            <div className="flex items-center gap-2">
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

      {selectedCompany &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedCompany(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <CompanyForm
                  mode="edit"
                  companyId={selectedCompany.id}
                  initialData={selectedCompanyFormData}
                  existingProfilePhotoUrl={
                    selectedCompany.company_logo ?? undefined
                  }
                  onSuccess={() => setSelectedCompany(null)}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
