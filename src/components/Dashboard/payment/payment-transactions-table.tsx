"use client";

import { Button } from "@/components/ui-elements/button";
import { StatusBadge } from "@/components/ui-elements/status-badge";
import { DataTable } from "@/components/Tables";
import {
  ActionType,
  type PaymentTransactionRow,
  type PaymentTransactionsTableProps,
} from "@/types/dashboard/payment";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { PaymentAutoRenewBadge } from "./payment-auto-renew-badge";
import { PaymentMemberCell } from "./payment-member-cell";
import { Modal } from "@/components/ui/modal";
import { InvoiceGenerateModal } from "@/app/(app)/dashboard/company/payment/component/invoice-generate-modal";
import { InvoiceData } from "@/app/(app)/dashboard/company/payment/component/invoice-template";
import { InvoicePdfDocument } from "@/app/(app)/dashboard/company/payment/component/invoice-pdf-document";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";

const filterInputClasses =
  "h-11 rounded-[10px] border border-stroke bg-transparent px-4 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white";

const getMonthLabel = (dateValue: string) => {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};


export function PaymentTransactionsTable({
  rows,
  filters,
}: PaymentTransactionsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState(
    filters.statuses[0] ?? "All Status",
  );
  const [selectedPlan, setSelectedPlan] = useState(
    filters.plans[0] ?? "All Plans",
  );
  const [selectedMethod, setSelectedMethod] = useState(
    filters.methods[0] ?? "All Methods",
  );
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  const [selectedPayment, setSelectedPayment] = useState<PaymentTransactionRow | null>(null);
  const [openInvoiceModal, setOpenInvoiceModal] = useState<boolean>(false);
  const [generatingInvoice, setGeneratingInvoice] = useState<boolean>(false);

  const monthOptions = useMemo(
    () => ["All Months", ...filters.months],
    [filters.months],
  );

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesStatus =
          selectedStatus === "All Status"
            ? true
            : selectedStatus === "Overdue"
              ? row.status.startsWith("Overdue")
              : row.status === selectedStatus;

        const matchesPlan =
          selectedPlan === "All Plans" ? true : row.plan === selectedPlan;

        const matchesMethod =
          selectedMethod === "All Methods"
            ? true
            : row.method === selectedMethod;

        const matchesMonth =
          selectedMonth === "All Months"
            ? true
            : getMonthLabel(row.date) === selectedMonth;

        return matchesStatus && matchesPlan && matchesMethod && matchesMonth;
      }),
    [rows, selectedMethod, selectedMonth, selectedPlan, selectedStatus],
  );

  function handleActionClick(row: PaymentTransactionRow) {
    setSelectedPayment(row);
    if(row.action === ActionType.INVOICE) {
      setOpenInvoiceModal(true);
    }
  }

  const columns: ColumnDef<PaymentTransactionRow>[] = [
    {
      accessorKey: "invoice",
      header: "Invoice",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.invoice}
        </span>
      ),
      meta: {
        align: "left",
        headClassName: "min-w-[140px]",
      },
    },
    {
      id: "member",
      accessorFn: (row) => `${row.member.name} ${row.member.email}`,
      header: "Member",
      cell: ({ row }) => <PaymentMemberCell member={row.original.member} />,
      meta: {
        align: "left",
        headClassName: "min-w-[220px]",
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {row.original.plan}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium text-dark dark:text-white">
          {row.original.amount}
        </span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "autoRenew",
      accessorFn: (row) => (row.autoRenew ? "Enabled" : "Off"),
      header: "Auto-Renew",
      cell: ({ row }) => (
        <PaymentAutoRenewBadge enabled={row.original.autoRenew} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.status}
          tone={row.original.statusTone}
        />
      ),
    },
    {
      id: "action",
      accessorFn: () => "",
      header: "Actions",
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <Button
          onClick={() => handleActionClick(row.original)}
          label={row.original.actionLabel}
          size="small"
          variant={row.original.actionVariant}
        />
      ),
      meta: {
        align: "right",
      },
    },
  ];

  async function handleGenerateInvoice(
    values: InvoiceData
  ) {
    try {
      setGeneratingInvoice(true);

      const blob = await pdf(<InvoicePdfDocument data={values} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${values.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setOpenInvoiceModal(false);
        setSelectedPayment(null);
        toast.success("PDF generated and downloaded");
      }, 300);
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setGeneratingInvoice(false);
    }
  }

  return (
    <>
      {openInvoiceModal && (
        <InvoiceGenerateModal
          open={openInvoiceModal}
          payment={selectedPayment}
          loading={generatingInvoice}
          onClose={() => {
            setOpenInvoiceModal(false);
            setSelectedPayment(null);
          }}
          onGenerate={handleGenerateInvoice}
        />
      )}
      <DataTable
        title="Transaction Log"
        description={`All payment records. ${filteredRows.length} matching result${filteredRows.length === 1 ? "" : "s"}.`}
        data={filteredRows}
        columns={columns}
        getRowId={(row) => row.invoice}
        tableClassName="min-w-[980px]"
        searchPlaceholder="Search member, invoice, plan..."
        initialPageSize={5}
        headerActions={
          <>
            <div className="grid w-full gap-3 xl:grid-cols-4">
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className={filterInputClasses}
              >
                {filters.statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={selectedPlan}
                onChange={(event) => setSelectedPlan(event.target.value)}
                className={filterInputClasses}
              >
                {filters.plans.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={selectedMethod}
                onChange={(event) => setSelectedMethod(event.target.value)}
                className={filterInputClasses}
              >
                {filters.methods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className={filterInputClasses}
              >
                {monthOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </>
        }
      />
    </>
  );
}
