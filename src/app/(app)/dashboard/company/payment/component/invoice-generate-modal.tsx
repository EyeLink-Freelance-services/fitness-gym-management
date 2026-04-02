"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import type { PaymentTransactionRow } from "@/types/dashboard/payment";
import InvoiceTemplate, { InvoiceData } from "./invoice-template";
import { createPortal } from "react-dom";

const invoiceGenerateModalSchema = z.object({
  dueDate: z.string().min(1, "Due date is required"),
  discount: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine((value) => value === "" || !Number.isNaN(Number(value)), {
      message: "Discount must be a valid number",
    })
    .refine((value) => value === "" || Number(value) >= 0, {
      message: "Discount cannot be negative",
    }).optional(),
  notes: z.string().max(500, "Notes is too long").optional(),
});

export type InvoiceGenerateModalFormValues = z.infer<
  typeof invoiceGenerateModalSchema
>;

type Props = {
  open: boolean;
  payment: PaymentTransactionRow | null;
  loading?: boolean;
  onClose: () => void;
  onGenerate: (
    values: InvoiceData
  ) => Promise<void> | void;
};

function getDefaultDueDate(dateValue?: string) {
  const baseDate = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 7);
    return fallback.toISOString().split("T")[0];
  }

  baseDate.setDate(baseDate.getDate() + 7);
  return baseDate.toISOString().split("T")[0];
}

function parseAmount(value: string | number) {
  if (typeof value === "number") return value;

  const normalized = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildInvoicePreview(
  values: InvoiceGenerateModalFormValues,
  payment: PaymentTransactionRow,
): InvoiceData {
  const amount = parseAmount(payment.amount);
  const discount = values.discount ? Number(values.discount) : 0;

  return {
    brandName: "FlexFit Studio",
    invoiceTitle: "Invoice",
    invoiceNumber: payment.invoice,
    issueDate: payment.date,
    dueDate: values.dueDate,
    currency: "MUR",
    from: {
      name: "FlexFit Studio",
      addressLine1: "12 Royal Road",
      city: "Beau Bassin",
      country: "Mauritius",
      email: "billing@flexfitstudio.com",
    },
    billTo: {
      name: payment.member.name,
      email: payment.member.email,
    },
    items: [
      {
        id: "invoice 1",
        description: payment.plan,
        quantity: 1,
        unitCost: amount,
      },
      {
        id: "invoice 2",
        description: payment.plan,
        quantity: 1,
        unitCost: amount,
      },
      
    ],
    discount,
    taxRate: 0,
    notes: values.notes,
  };
}

export function InvoiceGenerateModal({
  open,
  payment,
  loading = false,
  onClose,
  onGenerate,
}: Props) {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [previewData, setPreviewData] = useState<InvoiceData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InvoiceGenerateModalFormValues>({
    resolver: zodResolver(invoiceGenerateModalSchema),
    defaultValues: {
      dueDate: "",
      discount: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open || !payment) return;

    reset({
      dueDate: getDefaultDueDate(payment.date),
      discount: "",
      notes: "",
    });
    setMode("form");
    setPreviewData(null);
  }, [open, payment, reset]);

  const discountValue = watch("discount");
  const paymentAmount = parseAmount(payment?.amount ?? 0);
  const discount = discountValue ? Number(discountValue) : 0;
  const total = Math.max(paymentAmount - discount, 0);

  const handlePreview = handleSubmit((values) => {
    if (!payment) return;

    const preview = buildInvoicePreview(values, payment);
    setPreviewData(preview);
    setMode("preview");
  });


  async function handleGenerateInvoice() {
    if (!previewData) return;
    await onGenerate(previewData);
  }

  const scale = Math.max(0.36, 0.52 - 0.02 * ((previewData?.items.length ?? 1) - 1));

  return mode === "form" ? (
    <Modal
      open={open}
      badge="Billing"
      title="Generate Invoice"
      description="Review the invoice details before creating the PDF."
      onClose={onClose}
    >
      {!payment ? null : (
        <form onSubmit={handlePreview} className="flex h-full flex-col">
          <div className="max-h-[70vh] space-y-6 overflow-y-auto px-1 pb-28">
            <div className="rounded-2xl border border-stroke bg-slate-50 p-4 dark:border-dark-3 dark:bg-dark-2">
              <h3 className="mb-4 text-sm font-semibold text-dark dark:text-white">
                Payment Summary
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">Invoice</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.invoice}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">Member</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.member.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">Plan</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.plan}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">
                    Payment Method
                  </p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.method}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">
                    Payment Date
                  </p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-body-color dark:text-dark-6">Amount</p>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {payment.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InputGroup
                label="Due Date"
                type="date"
                inputProps={register("dueDate")}
                error={errors.dueDate?.message}
              />

              <InputGroup
                label="Discount"
                type="number"
                step="0.01"
                placeholder="0.00"
                inputProps={register("discount")}
                error={errors.discount?.message}
              />
            </div>

            <TextAreaGroup
              label="Notes"
              rows={4}
              placeholder="Add optional notes for the invoice"
              textareaProps={register("notes")}
              error={errors.notes?.message}
            />

            <div className="rounded-2xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark">
              <h3 className="mb-4 text-sm font-semibold text-dark dark:text-white">
                Invoice Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-body-color dark:text-dark-6">Subtotal</span>
                  <span className="font-medium text-dark dark:text-white">
                    {payment.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-body-color dark:text-dark-6">Discount</span>
                  <span className="font-medium text-dark dark:text-white">
                    {discount.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-stroke dark:bg-dark-3" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-dark dark:text-white">
                    Total
                  </span>
                  <span className="text-base font-semibold text-primary">
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-stroke bg-white px-6 py-4 dark:border-dark-3 dark:bg-dark">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="danger"
                label="Cancel"
                onClick={onClose}
              />
              <Button
                type="submit"
                label="Preview"
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  ) : (
    <Modal
      open={open}
      onClose={() => setMode("form")}
      maxWidth="max-w-4xl"
      hideHeader
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="invoice-preview-scroll flex-1 overflow-y-hidden bg-slate-100 dark:bg-slate-800 px-4 pt-2 md:px-6">
          <div 
            className="mx-auto origin-top w-full max-w-[920px] rounded-[24px] bg-white 
            shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06),0_20px_60px_rgba(0,0,0,0.10)]"
            style={{
              transform: `scale(${scale})`
            }}
          > 
            {previewData ? <InvoiceTemplate data={previewData} /> : null}
          </div>
        </div>

        <div className="relative z-20 border-t border-stroke bg-white px-5 py-4 dark:border-dark-3 dark:bg-dark-2">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outlineDark"
              label="Back"
              onClick={() => setMode("form")}
            />
            <Button
              type="button"
              label={"Generate Invoice"}
              onClick={handleGenerateInvoice}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}