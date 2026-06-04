"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { companyClientColumns } from "@/components/Dashboard/table-column/company-columns";
import ClientForm from "@/components/Forms/ClientForm";
import { DataTable } from "@/components/Tables";
import type {
  CompanyClient,
  CompanyClientsTableClientProps,
} from "@/types/dashboard/company";
import { mapCompanyClientToFormValues } from "@/modules/company/company-client.mappers";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { usePagination } from "@/hooks/use-pagination";
import { fetchCompanyClientPage } from "@/app/(app)/dashboard/company/clients/actions";
import { Button } from "@/components/ui-elements/button";
import { cn } from "@/lib/utils";

export function CompanyClientsTableClient({
  initialData,
  totalCount,
  companyPricing,
}: CompanyClientsTableClientProps) {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<CompanyClient | null>(null);
  const [mounted, setMounted] = useState(false);

  const defaultStandardPrice = companyPricing;
  const titleId = useId();

  const pagination = usePagination({
    initialData,
    initialTotalCount: totalCount,
    pageSize: 10,
    fetchFn: async (pageNumber, pageSize) => {
      const { clients, totalCount } = await fetchCompanyClientPage(
        pageNumber,
        pageSize,
      );
      return {
        data: clients,
        totalCount,
      };
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedClient) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedClient(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedClient]);

  const selectedClientFormData = selectedClient
    ? mapCompanyClientToFormValues(selectedClient)
    : undefined;

  const handleEditSuccess = () => {
    setSelectedClient(null);
    void pagination.refetchCurrentPage();
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <FormModalTrigger
            buttonLabel="+ Add Client"
            formType="client"
            companyPlan={defaultStandardPrice}
            onSuccess={() => {
              void pagination.refetchCurrentPage();
              router.refresh();
            }}
          />
        </div>

        <DataTable
          title="Clients"
          description="Clients from the company"
          data={pagination.data}
          columns={companyClientColumns}
          getRowId={(row) => row.id}
          tableClassName="min-w-[780px]"
          searchPlaceholder="Search client, contact, plan..."
          initialPageSize={10}
          emptyStateLabel="No clients available."
          onRowClick={setSelectedClient}
          showFooter={false}
        />

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

      {selectedClient &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedClient(null);
              }
            }}
          >
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-2">
              <div className="max-h-[85vh] overflow-y-auto p-4">
                <ClientForm
                  mode="edit"
                  clientId={selectedClient.id}
                  initialData={selectedClientFormData}
                  companyPlan={defaultStandardPrice}
                  onSuccess={handleEditSuccess}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
