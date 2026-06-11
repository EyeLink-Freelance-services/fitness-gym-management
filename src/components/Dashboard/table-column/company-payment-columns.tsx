import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import {
  formatBillingMonthLabel,
  getPaymentPlanLabel,
} from "@/modules/company/company-payment.mappers";
import type { CompanyPaymentRow } from "@/types/dashboard/company-payment";
import type { ColumnDef } from "@tanstack/react-table";

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value?: number) {
  if (value == null) return "-";
  return `Rs ${value.toLocaleString()}`;
}

type CompanyPaymentColumnOptions = {
  processingId: string | null;
  onMarkPaid: (row: CompanyPaymentRow) => void;
};

export function getCompanyPaymentColumns({
  processingId,
  onMarkPaid,
}: CompanyPaymentColumnOptions): ColumnDef<CompanyPaymentRow>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.clientName}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[160px]",
      },
    },
    {
      id: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {getPaymentPlanLabel(row.original.membershipPlan)}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[140px]",
      },
    },
    {
      id: "billingMonth",
      header: "Billing Month",
      cell: ({ row }) => formatBillingMonthLabel(row.original.billingMonth),
      meta: {
        align: "left",
        headClassName: "min-w-[140px]",
      },
    },
    {
      id: "standardPrice",
      header: "Standard Price",
      cell: ({ row }) => formatCurrency(row.original.standardPrice),
      meta: {
        align: "left",
        headClassName: "min-w-[130px]",
      },
    },
    {
      id: "additionalFees",
      header: "Additional Fees",
      cell: ({ row }) => formatCurrency(row.original.additionalFees),
      meta: {
        align: "left",
        headClassName: "min-w-[130px]",
      },
    },
    {
      id: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {formatCurrency(row.original.amount)}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[120px]",
      },
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-dark-6 dark:text-dark-6">
          {formatDate(row.original.paidDate)}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[120px]",
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.isPaid ? "Paid" : "Unpaid"}
          tone={row.original.isPaid ? "success" : "warning"}
        />
      ),
      meta: {
        headClassName: "min-w-[110px]",
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const isProcessing = processingId === row.original.id;

        if (row.original.isPaid) {
          return (
            <Button
              type="button"
              label="Completed"
              size="small"
              variant="disabled"
              disabled
            />
          );
        }

        return (
          <Button
            type="button"
            label={isProcessing ? "Saving..." : "Mark Paid"}
            size="small"
            variant="primary"
            disabled={isProcessing}
            onClick={() => onMarkPaid(row.original)}
          />
        );
      },
      meta: {
        align: "right",
        headClassName: "min-w-[140px]",
      },
    },
  ];
}
