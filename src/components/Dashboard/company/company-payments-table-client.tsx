"use client";

import {
  fetchCompanyPaymentPage,
  markClientPaymentPaidAction,
} from "@/app/(app)/dashboard/company/payment/actions";
import { getCompanyPaymentColumns } from "@/components/Dashboard/table-column/company-payment-columns";
import { DataTable } from "@/components/Tables";
import { Button } from "@/components/ui-elements/button";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { formatBillingMonthLabel } from "@/modules/company/company-payment.mappers";
import type {
  CompanyPaymentRow,
  CompanyPaymentsTableClientProps,
} from "@/types/dashboard/company-payment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export function CompanyPaymentsTableClient({
  initialData,
  totalCount,
  billingMonth,
}: CompanyPaymentsTableClientProps) {
  const router = useRouter();
  const [selectedBillingMonth, setSelectedBillingMonth] = useState(billingMonth);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paidRows, setPaidRows] = useState<Record<string, CompanyPaymentRow>>({});

  const fetchPage = useCallback(
    async (pageNumber: number, pageSize: number, search: string) => {
      const { payments, totalCount } = await fetchCompanyPaymentPage(
        pageNumber,
        pageSize,
        selectedBillingMonth,
        search,
      );
      return {
        data: payments,
        totalCount,
      };
    },
    [selectedBillingMonth],
  );

  const pagination = usePagination({
    initialData,
    initialTotalCount: totalCount,
    pageSize: 10,
    fetchFn: fetchPage,
  });

  const tableData = useMemo(
    () => pagination.data.map((row) => paidRows[row.id] ?? row),
    [pagination.data, paidRows],
  );

  const skipMonthFetchRef = useRef(true);

  useEffect(() => {
    if (skipMonthFetchRef.current) {
      skipMonthFetchRef.current = false;
      return;
    }

    void pagination.goToPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when billing month changes only
  }, [selectedBillingMonth]);

  const handleMarkPaid = useCallback(
    async (row: CompanyPaymentRow) => {
      setProcessingId(row.id);
      try {
        await markClientPaymentPaidAction(row.clientId, row.billingMonth);

        const paidRow: CompanyPaymentRow = {
          ...row,
          isPaid: true,
          paidDate: new Date().toISOString(),
        };

        setPaidRows((previous) => ({
          ...previous,
          [row.id]: paidRow,
        }));

        await pagination.refetchCurrentPage();
        router.refresh();
        toast.success("Payment marked as paid");
      } catch (error) {
        console.error("Failed to mark payment as paid:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to mark payment as paid",
        );
      } finally {
        setProcessingId(null);
      }
    },
    [pagination, router],
  );

  const columns = getCompanyPaymentColumns({
    processingId,
    onMarkPaid: handleMarkPaid,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Billing month: {formatBillingMonthLabel(selectedBillingMonth)}
          </p>
        </div>

        <input
          type="month"
          value={selectedBillingMonth}
          onChange={(event) => {
            setSelectedBillingMonth(event.target.value);
            setPaidRows({});
          }}
          className="h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
        />
      </div>

      <DataTable
        title="Payments"
        description="Client billing records for the selected month."
        data={tableData}
        columns={columns}
        getRowId={(row) => row.id}
        tableClassName="min-w-[980px]"
        searchPlaceholder="Search client, plan, billing month..."
        searchValue={pagination.search}
        onSearchChange={pagination.setSearch}
        initialPageSize={10}
        emptyStateLabel="No payment records available."
        showFooter={false}
        isLoading={pagination.isLoading}
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
  );
}
