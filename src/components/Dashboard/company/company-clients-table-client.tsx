"use client";

import { FormModalTrigger } from "@/components/Dashboard/form-modal-trigger";
import { getCompanyClientColumns } from "@/components/Dashboard/table-column/company-columns";
import { DataTable } from "@/components/Tables";
import type {
  CompanyClient,
  CompanyClientsTableClientProps,
} from "@/types/dashboard/company";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { fetchCompanyClientPage } from "@/app/(app)/dashboard/company/clients/actions";
import { Button } from "@/components/ui-elements/button";
import { ROUTES } from "@/constants/route";
import { cn } from "@/lib/utils";

export function CompanyClientsTableClient({
  initialData,
  totalCount,
  companyPricing,
}: CompanyClientsTableClientProps) {
  const router = useRouter();

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

  const handleRowClick = (client: CompanyClient) => {
    router.push(ROUTES.DASHBOARD.COMPANY.CLIENT_PROFILE(client.id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FormModalTrigger
          buttonLabel="+ Add Client"
          formType="client"
          companyPlan={companyPricing}
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
        columns={getCompanyClientColumns(companyPricing)}
        getRowId={(row) => row.id}
        tableClassName="min-w-[780px]"
        searchPlaceholder="Search client, contact, plan..."
        initialPageSize={10}
        emptyStateLabel="No clients available."
        onRowClick={handleRowClick}
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
  );
}
